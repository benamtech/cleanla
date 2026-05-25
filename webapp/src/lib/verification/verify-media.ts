import type { SupabaseClient } from "@supabase/supabase-js";
import {
  MAX_GPS_ACCURACY_M,
  MAX_UPLOAD_AGE_MIN,
  VERIFY_RADIUS_M,
} from "@/features/reports/constants";
import type { VerificationReason, VerificationStatus } from "@/features/spots/types";

type VerifyMediaInput = {
  spotMediaId: string;
  spotId: string;
  captureSource: string | null;
  capturedLat: number | null;
  capturedLng: number | null;
  gpsAccuracyM: number | null;
  clientCapturedAt: string | null;
  serverReceivedAt: string;
};

export type VerifyMediaResult =
  | { status: "verified"; reason: "verified_on_site"; distanceM: number }
  | {
      status: "unverified";
      reason:
        | "library_upload"
        | "missing_capture_metadata"
        | "stale_upload"
        | "location_unconfirmed";
      distanceM: null;
    }
  | { status: "location_mismatch"; reason: "location_mismatch"; distanceM: number }
  | { status: "pending"; reason: "server_error"; distanceM: null };

export async function verifyMedia(
  admin: SupabaseClient,
  input: VerifyMediaInput,
): Promise<VerifyMediaResult> {
  try {
    // 1. Source check
    if (input.captureSource !== "live_camera") {
      return await applyResult(admin, input, "unverified", "library_upload", null);
    }

    // 2. Required metadata check
    if (
      input.capturedLat === null ||
      input.capturedLng === null ||
      input.gpsAccuracyM === null ||
      input.clientCapturedAt === null
    ) {
      return await applyResult(
        admin,
        input,
        "unverified",
        "missing_capture_metadata",
        null,
      );
    }

    // 3. Freshness check — server clock is authoritative
    const ageMs =
      Date.parse(input.serverReceivedAt) - Date.parse(input.clientCapturedAt);
    if (ageMs > MAX_UPLOAD_AGE_MIN * 60 * 1000) {
      return await applyResult(admin, input, "unverified", "stale_upload", null);
    }

    // 4. GPS accuracy check
    if (input.gpsAccuracyM > MAX_GPS_ACCURACY_M) {
      return await applyResult(
        admin,
        input,
        "unverified",
        "location_unconfirmed",
        null,
      );
    }

    // 5. Distance check via PostGIS RPC
    const { data: distanceM, error: distanceError } = await admin.rpc(
      "compute_media_distance_m",
      {
        p_spot_id: input.spotId,
        p_lat: input.capturedLat,
        p_lng: input.capturedLng,
      },
    );

    if (distanceError || typeof distanceM !== "number") {
      throw new Error("distance_rpc_failed");
    }

    const threshold = VERIFY_RADIUS_M + input.gpsAccuracyM;
    if (distanceM <= threshold) {
      return await applyResult(admin, input, "verified", "verified_on_site", distanceM);
    } else {
      return await applyResult(
        admin,
        input,
        "location_mismatch",
        "location_mismatch",
        distanceM,
      );
    }
  } catch {
    // 6. Error fallback — leave verification_status as 'pending', stamp reason only
    try {
      await admin
        .from("spot_media")
        .update({ verification_reason: "server_error" })
        .eq("id", input.spotMediaId);
    } catch {
      // intentionally empty
    }
    return { status: "pending", reason: "server_error", distanceM: null };
  }
}

async function applyResult(
  admin: SupabaseClient,
  input: VerifyMediaInput,
  status: VerificationStatus,
  reason: VerificationReason,
  distanceM: number | null,
): Promise<VerifyMediaResult> {
  const mediaUpdate: Record<string, unknown> = {
    verification_status: status,
    verification_reason: reason,
  };
  if (distanceM !== null) {
    mediaUpdate.distance_from_spot_m = distanceM;
  }

  const { error } = await admin
    .from("spot_media")
    .update(mediaUpdate)
    .eq("id", input.spotMediaId);

  if (error) throw new Error("spot_media_update_failed");

  // Aggregate: a spot is verified when it has at least one verified media item
  if (status === "verified") {
    const { error: spotErr } = await admin
      .from("spots")
      .update({ verification_status: "verified" })
      .eq("id", input.spotId);

    if (spotErr) {
      // Non-fatal: media row is the source of truth; spot propagation can be retried
      console.error("[verifyMedia] spot aggregate update failed:", spotErr);
    }
  }

  return { status, reason, distanceM } as VerifyMediaResult;
}
