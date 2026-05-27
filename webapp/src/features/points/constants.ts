import type { SpotCategory } from "@/features/spots/types";

export const MIN_REWARD_POINTS = 200;
export const CLAIM_EXPIRY_DAYS = 7;

export const CATEGORY_POINT_VALUES: Record<SpotCategory, number> = {
  trash: 5,
  graffiti: 10,
  overgrowth: 15,
  encampment_debris: 25,
  illegal_dumping: 35,
  biohazard: 50,
};

export function pointsForCategory(category: SpotCategory): number {
  return CATEGORY_POINT_VALUES[category];
}

export function formatPoints(points: number): string {
  return `${points.toLocaleString("en-US")} PTS`;
}
