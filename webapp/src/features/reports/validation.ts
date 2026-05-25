import { MAX_UPLOAD_AGE_MIN } from "@/features/reports/constants";

export function parseFiniteNumber(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function parseDeviceContext(
  value: FormDataEntryValue | null,
): Record<string, unknown> {
  if (typeof value !== "string" || value.trim() === "") return {};
  try {
    const parsed: unknown = JSON.parse(value);
    return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

export function validateUploadAge(timestamp: string): boolean {
  const capturedAt = Date.parse(timestamp);
  if (!Number.isFinite(capturedAt)) return false;
  const maxAgeMs = MAX_UPLOAD_AGE_MIN * 60 * 1000;
  return Math.abs(Date.now() - capturedAt) <= maxAgeMs;
}
