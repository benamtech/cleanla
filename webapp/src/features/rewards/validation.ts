import { MIN_REWARD_POINTS } from "@/features/points/constants";

export type RewardInput = {
  title: string;
  description: string;
  points_required: number;
  redemption_instructions: string | null;
  is_active: boolean;
};

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function cleanOptional(value: unknown): string | null {
  const cleaned = clean(value);
  return cleaned.length > 0 ? cleaned : null;
}

export function parseRewardInput(body: unknown):
  | { ok: true; data: RewardInput }
  | { ok: false; error: string; status: number } {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "INVALID_BODY", status: 400 };
  }

  const record = body as Record<string, unknown>;
  const title = clean(record.title);
  const description = clean(record.description);
  const pointsRequired = Number(record.points_required);

  if (title.length < 2) {
    return { ok: false, error: "TITLE_REQUIRED", status: 400 };
  }

  if (description.length < 2) {
    return { ok: false, error: "DESCRIPTION_REQUIRED", status: 400 };
  }

  if (!Number.isInteger(pointsRequired) || pointsRequired < MIN_REWARD_POINTS) {
    return { ok: false, error: "POINTS_MINIMUM_200", status: 400 };
  }

  return {
    ok: true,
    data: {
      title,
      description,
      points_required: pointsRequired,
      redemption_instructions: cleanOptional(record.redemption_instructions),
      is_active: record.is_active === true,
    },
  };
}

export function normalizeClaimCode(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  return normalized.length >= 6 && normalized.length <= 16 ? normalized : null;
}
