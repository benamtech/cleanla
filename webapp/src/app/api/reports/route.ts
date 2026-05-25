import { NextResponse } from "next/server";
import {
  MAX_UPLOAD_AGE_MIN,
  REPORT_DESCRIPTION_MAX_LENGTH,
  REPORT_DESCRIPTION_MIN_LENGTH,
  REPORT_SEVERITIES,
} from "@/features/reports/constants";
import { SPOT_CATEGORIES, type SpotCategory } from "@/features/spots/types";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type ReportValidation =
  | {
      ok: true;
      photo: File;
      category: SpotCategory;
      severity: number;
      description: string;
      lat: number;
      lng: number;
      gpsAccuracyM: number;
      clientCapturedAt: string;
      deviceContext: Record<string, unknown>;
    }
  | { ok: false; error: string; status: number };

function parseFiniteNumber(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseDeviceContext(
  value: FormDataEntryValue | null,
): Record<string, unknown> {
  if (typeof value !== "string" || value.trim() === "") return {};

  try {
    const parsed: unknown = JSON.parse(value);
    return typeof parsed === "object" &&
      parsed !== null &&
      !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

function validateUploadAge(timestamp: string): boolean {
  const capturedAt = Date.parse(timestamp);
  if (!Number.isFinite(capturedAt)) return false;

  const maxAgeMs = MAX_UPLOAD_AGE_MIN * 60 * 1000;
  return Math.abs(Date.now() - capturedAt) <= maxAgeMs;
}

function validateFormData(formData: FormData): ReportValidation {
  const photo = formData.get("photo");
  const category = formData.get("category");
  const severity = parseFiniteNumber(formData.get("severity"));
  const description = formData.get("description");
  const lat = parseFiniteNumber(formData.get("lat"));
  const lng = parseFiniteNumber(formData.get("lng"));
  const gpsAccuracyM = parseFiniteNumber(formData.get("gps_accuracy_m"));
  const clientCapturedAt = formData.get("client_captured_at");

  if (!(photo instanceof File) || photo.size <= 0) {
    return { ok: false, error: "PHOTO_REQUIRED", status: 400 };
  }

  if (photo.type !== "image/webp") {
    return { ok: false, error: "PHOTO_MUST_BE_WEBP", status: 400 };
  }

  if (
    typeof category !== "string" ||
    !SPOT_CATEGORIES.includes(category as SpotCategory)
  ) {
    return { ok: false, error: "INVALID_CATEGORY", status: 400 };
  }

  if (
    severity === null ||
    !REPORT_SEVERITIES.includes(severity as 1 | 2 | 3 | 4 | 5)
  ) {
    return { ok: false, error: "INVALID_SEVERITY", status: 400 };
  }

  if (typeof description !== "string") {
    return { ok: false, error: "DESCRIPTION_REQUIRED", status: 400 };
  }

  const trimmedDescription = description.trim();
  if (
    trimmedDescription.length < REPORT_DESCRIPTION_MIN_LENGTH ||
    trimmedDescription.length > REPORT_DESCRIPTION_MAX_LENGTH
  ) {
    return { ok: false, error: "INVALID_DESCRIPTION", status: 400 };
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
    photo,
    category: category as SpotCategory,
    severity,
    description: trimmedDescription,
    lat,
    lng,
    gpsAccuracyM,
    clientCapturedAt,
    deviceContext: parseDeviceContext(formData.get("device_context")),
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
  const report = validateFormData(formData);

  if (!report.ok) {
    return NextResponse.json(
      { error: report.error },
      { status: report.status },
    );
  }

  const admin = createAdminClient();
  const { error: profileError } = await admin.from("profiles").upsert(
    {
      id: user.id,
      email: user.email ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (profileError) {
    return NextResponse.json(
      { error: "PROFILE_CREATE_FAILED" },
      { status: 500 },
    );
  }

  const { data: spotId, error: spotError } = await admin.rpc(
    "create_phase3_report_spot",
    {
      p_category: report.category,
      p_description: report.description,
      p_lat: report.lat,
      p_lng: report.lng,
      p_created_by: user.id,
      p_severity: report.severity,
    },
  );

  if (spotError || typeof spotId !== "string") {
    return NextResponse.json({ error: "DATABASE_FAILURE" }, { status: 500 });
  }

  const mediaId = crypto.randomUUID();
  const mediaPath = `${user.id}/${spotId}/${mediaId}.webp`;
  const { error: uploadError } = await admin.storage
    .from("report-photos")
    .upload(mediaPath, report.photo, {
      contentType: "image/webp",
      upsert: false,
    });

  if (uploadError) {
    await admin.from("spots").delete().eq("id", spotId);
    return NextResponse.json({ error: "UPLOAD_FAILURE" }, { status: 502 });
  }

  const {
    data: { publicUrl },
  } = admin.storage.from("report-photos").getPublicUrl(mediaPath);

  const { error: mediaError } = await admin.from("spot_media").insert({
    id: mediaId,
    spot_id: spotId,
    media_kind: "report",
    media_url: publicUrl,
    created_by: user.id,
    capture_source: "live_camera",
    captured_lat: report.lat,
    captured_lng: report.lng,
    gps_accuracy_m: report.gpsAccuracyM,
    client_captured_at: report.clientCapturedAt,
    server_received_at: new Date().toISOString(),
    distance_from_spot_m: null,
    device_context: report.deviceContext,
    verification_status: "pending",
    verification_reason: "awaiting_phase_3_5_verification",
  });

  if (mediaError) {
    await admin.storage.from("report-photos").remove([mediaPath]);
    await admin.from("spots").delete().eq("id", spotId);
    return NextResponse.json({ error: "DATABASE_FAILURE" }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    spot_id: spotId,
    spot_media_id: mediaId,
    verification_status: "pending",
  });
}
