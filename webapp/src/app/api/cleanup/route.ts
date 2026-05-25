import { NextResponse } from "next/server";
import {
  parseFiniteNumber,
  validateUploadAge,
} from "@/features/reports/validation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { verifyMedia } from "@/lib/verification/verify-media";

export const dynamic = "force-dynamic";

type CleanupValidation =
  | {
      ok: true;
      spotId: string;
      photo: File;
      lat: number;
      lng: number;
      gpsAccuracyM: number;
      clientCapturedAt: string;
    }
  | { ok: false; error: string; status: number };

function validateFormData(formData: FormData): CleanupValidation {
  const spotId = formData.get("spot_id");
  const photo = formData.get("photo");
  const lat = parseFiniteNumber(formData.get("lat"));
  const lng = parseFiniteNumber(formData.get("lng"));
  const gpsAccuracyM = parseFiniteNumber(formData.get("gps_accuracy_m"));
  const clientCapturedAt = formData.get("client_captured_at");

  if (typeof spotId !== "string" || spotId.trim() === "") {
    return { ok: false, error: "SPOT_ID_REQUIRED", status: 400 };
  }

  if (!(photo instanceof File) || photo.size <= 0) {
    return { ok: false, error: "PHOTO_REQUIRED", status: 400 };
  }

  if (photo.type !== "image/webp") {
    return { ok: false, error: "PHOTO_MUST_BE_WEBP", status: 400 };
  }

  if (
    lat === null ||
    lat < -90 ||
    lat > 90 ||
    lng === null ||
    lng < -180 ||
    lng > 180
  ) {
    return { ok: false, error: "INVALID_LOCATION", status: 400 };
  }

  if (gpsAccuracyM === null || gpsAccuracyM < 0) {
    return { ok: false, error: "INVALID_GPS_ACCURACY", status: 400 };
  }

  if (
    typeof clientCapturedAt !== "string" ||
    !validateUploadAge(clientCapturedAt)
  ) {
    return { ok: false, error: "INVALID_CAPTURE_TIMESTAMP", status: 400 };
  }

  return {
    ok: true,
    spotId: spotId.trim(),
    photo,
    lat,
    lng,
    gpsAccuracyM,
    clientCapturedAt,
  };
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
  }

  const formData = await request.formData();
  const cleanup = validateFormData(formData);

  if (!cleanup.ok) {
    return NextResponse.json(
      { error: cleanup.error },
      { status: cleanup.status },
    );
  }

  const admin = createAdminClient();

  // Load the spot and validate its current state
  const { data: spot, error: spotError } = await admin
    .from("spots")
    .select("id, status")
    .eq("id", cleanup.spotId)
    .single();

  if (spotError || !spot) {
    return NextResponse.json({ error: "SPOT_NOT_FOUND" }, { status: 404 });
  }

  if (spot.status === "cleaned") {
    return NextResponse.json(
      { error: "SPOT_ALREADY_CLEANED" },
      { status: 409 },
    );
  }

  if (spot.status === "hidden") {
    return NextResponse.json({ error: "SPOT_HIDDEN" }, { status: 409 });
  }

  const mediaId = crypto.randomUUID();
  const mediaPath = `${user.id}/${cleanup.spotId}/${mediaId}.webp`;

  const { error: uploadError } = await admin.storage
    .from("report-photos")
    .upload(mediaPath, cleanup.photo, {
      contentType: "image/webp",
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: "UPLOAD_FAILURE" }, { status: 502 });
  }

  const {
    data: { publicUrl },
  } = admin.storage.from("report-photos").getPublicUrl(mediaPath);

  const serverReceivedAt = new Date().toISOString();

  const { error: mediaError } = await admin.from("spot_media").insert({
    id: mediaId,
    spot_id: cleanup.spotId,
    media_kind: "after",
    media_url: publicUrl,
    created_by: user.id,
    capture_source: "live_camera",
    captured_lat: cleanup.lat,
    captured_lng: cleanup.lng,
    gps_accuracy_m: cleanup.gpsAccuracyM,
    client_captured_at: cleanup.clientCapturedAt,
    server_received_at: serverReceivedAt,
    distance_from_spot_m: null,
    device_context: {},
    verification_status: "pending",
    verification_reason: "awaiting_phase_3_5_verification",
  });

  if (mediaError) {
    await admin.storage.from("report-photos").remove([mediaPath]);
    return NextResponse.json({ error: "DATABASE_FAILURE" }, { status: 500 });
  }

  const verification = await verifyMedia(admin, {
    spotMediaId: mediaId,
    spotId: cleanup.spotId,
    captureSource: "live_camera",
    capturedLat: cleanup.lat,
    capturedLng: cleanup.lng,
    gpsAccuracyM: cleanup.gpsAccuracyM,
    clientCapturedAt: cleanup.clientCapturedAt,
    serverReceivedAt,
  });

  // Only transition to cleaned when the after photo is fully verified on-site.
  if (verification.status === "verified") {
    const fromStatus = spot.status as string;

    const { error: updateError } = await admin
      .from("spots")
      .update({ status: "cleaned", updated_at: new Date().toISOString() })
      .eq("id", cleanup.spotId);

    if (!updateError) {
      await admin.from("contribution_history").insert({
        spot_id: cleanup.spotId,
        actor_id: user.id,
        action: "cleanup_submitted",
        from_status: fromStatus,
        to_status: "cleaned",
        spot_media_id: mediaId,
      });
    } else {
      console.error("[cleanup] spot status update failed:", updateError);
    }
  }

  return NextResponse.json({
    ok: true,
    spot_id: cleanup.spotId,
    verification_status: verification.status,
    verification_reason: verification.reason,
  });
}
