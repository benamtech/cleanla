export const SPOT_CATEGORIES = [
  "illegal_dumping",
  "trash",
  "graffiti",
  "encampment_debris",
  "biohazard",
  "overgrowth",
] as const;

export const SPOT_STATUSES = ["reported", "in_progress", "cleaned", "hidden"] as const;

export const VERIFICATION_STATUSES = [
  "pending",
  "verified",
  "unverified",
  "location_mismatch",
  "rejected",
] as const;

export type SpotCategory = (typeof SPOT_CATEGORIES)[number];
export type SpotStatus = (typeof SPOT_STATUSES)[number];
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

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
  media_url?: string | null;
};

export type SpotsBounds = {
  west: number;
  south: number;
  east: number;
  north: number;
  limit?: number;
};

