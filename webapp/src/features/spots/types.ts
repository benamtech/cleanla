export const SPOT_CATEGORIES = [
  "illegal_dumping",
  "trash",
  "graffiti",
  "encampment_debris",
  "biohazard",
  "overgrowth",
] as const;

export const SPOT_STATUSES = ["reported", "in_progress", "cleaned", "reopened", "hidden"] as const;

export const VERIFICATION_STATUSES = [
  "pending",
  "verified",
  "unverified",
  "location_mismatch",
  "rejected",
] as const;

export const VERIFICATION_REASONS = [
  "awaiting_phase_3_5_verification",
  "library_upload",
  "missing_capture_metadata",
  "stale_upload",
  "location_unconfirmed",
  "verified_on_site",
  "location_mismatch",
  "server_error",
] as const;

export type SpotCategory = (typeof SPOT_CATEGORIES)[number];
export type SpotStatus = (typeof SPOT_STATUSES)[number];
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];
export type VerificationReason = (typeof VERIFICATION_REASONS)[number];

export type SpotSummary = {
  id: string;
  category: SpotCategory;
  status: SpotStatus;
  description: string;
  neighborhood: string | null;
  severity: number | null;
  lat: number;
  lng: number;
  created_at: string;
  verification_status: VerificationStatus;
  report_media_url?: string | null;
  after_media_url?: string | null;
  // Public attribution (per 20260525001000_public_usernames.sql).
  // Null when the contributor never set a username — display as ANONYMOUS.
  reporter_username?: string | null;
  cleaner_username?: string | null;
};

export type SpotsBounds = {
  west: number;
  south: number;
  east: number;
  north: number;
  limit?: number;
};

