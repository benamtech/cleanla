import type { SpotCategory, SpotStatus, VerificationStatus } from "./types";

export const CATEGORY_COLORS: Record<SpotCategory, string> = {
  illegal_dumping: "#a60315",
  trash: "#001089",
  graffiti: "#c7a87d",
  encampment_debris: "#999999",
  biohazard: "#228B22",
  overgrowth: "#b8dae8",
};

const CATEGORY_LABELS: Record<SpotCategory, string> = {
  illegal_dumping: "ILLEGAL DUMPING",
  trash: "TRASH",
  graffiti: "GRAFFITI",
  encampment_debris: "ENCAMPMENT DEBRIS",
  biohazard: "BIOHAZARD",
  overgrowth: "OVERGROWTH",
};

const STATUS_LABELS: Record<SpotStatus, string> = {
  reported: "REPORTED",
  in_progress: "IN PROGRESS",
  cleaned: "CLEANED",
  hidden: "HIDDEN",
};

const VERIFICATION_LABELS: Record<VerificationStatus, string> = {
  pending: "PENDING",
  verified: "LOCATION-VERIFIED",
  unverified: "UNVERIFIED",
  location_mismatch: "LOCATION MISMATCH",
  rejected: "REJECTED",
};

export function formatCategory(category: SpotCategory): string {
  return CATEGORY_LABELS[category];
}

export function formatStatus(status: SpotStatus): string {
  return STATUS_LABELS[status];
}

export function formatVerification(status: VerificationStatus): string {
  return VERIFICATION_LABELS[status];
}

export function formatCoordinates(lat: number, lng: number): string {
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

