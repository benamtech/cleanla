"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SubmitResult } from "./types";

const PHOTO_BUCKET = "report-photos";
const MAX_PHOTO_BYTES = 8 * 1024 * 1024; // 8 MB ceiling, prevents accidental DOS via large uploads.
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

const MIN_DESCRIPTION_LEN = 3;
const MAX_DESCRIPTION_LEN = 240;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseLat(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string") return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  if (n < -90 || n > 90) return null;
  return n;
}

function parseLng(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string") return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  if (n < -180 || n > 180) return null;
  return n;
}

/**
 * Server action invoked by ReportForm. Validates input, uploads the photo to
 * the public bucket, inserts the row through the service role.
 *
 * Returns a SubmitResult — never throws to the caller, so the client form
 * always renders a useful message.
 */
export async function submitReport(formData: FormData): Promise<SubmitResult> {
  const photo = formData.get("photo");
  if (!(photo instanceof File) || photo.size === 0) {
    return { ok: false, error: "PHOTO IS REQUIRED — please add an image of the issue." };
  }
  if (photo.size > MAX_PHOTO_BYTES) {
    return { ok: false, error: "PHOTO TOO LARGE — please keep it under 8 MB." };
  }
  if (!ALLOWED_MIME.has(photo.type)) {
    return {
      ok: false,
      error: "PHOTO TYPE NOT SUPPORTED — JPEG, PNG, WebP, or HEIC only.",
    };
  }

  const lat = parseLat(formData.get("lat"));
  const lng = parseLng(formData.get("lng"));
  if (lat === null || lng === null) {
    return {
      ok: false,
      error: "LOCATION MISSING — tap GET MY LOCATION to capture coordinates.",
    };
  }

  const descriptionRaw = formData.get("description");
  const description = typeof descriptionRaw === "string" ? descriptionRaw.trim() : "";
  if (description.length < MIN_DESCRIPTION_LEN) {
    return {
      ok: false,
      error: `DESCRIPTION TOO SHORT — at least ${MIN_DESCRIPTION_LEN} characters.`,
    };
  }
  if (description.length > MAX_DESCRIPTION_LEN) {
    return {
      ok: false,
      error: `DESCRIPTION TOO LONG — ${MAX_DESCRIPTION_LEN} characters max.`,
    };
  }

  const emailRaw = formData.get("email_optional");
  let email_optional: string | null = null;
  if (typeof emailRaw === "string" && emailRaw.trim().length > 0) {
    const trimmed = emailRaw.trim();
    if (!EMAIL_REGEX.test(trimmed)) {
      return { ok: false, error: "EMAIL LOOKS INVALID — leave blank or fix it." };
    }
    email_optional = trimmed;
  }

  const neighborhoodRaw = formData.get("neighborhood");
  const neighborhood =
    typeof neighborhoodRaw === "string" && neighborhoodRaw.trim().length > 0
      ? neighborhoodRaw.trim().slice(0, 80)
      : null;

  let admin;
  try {
    admin = createAdminClient();
  } catch (err) {
    console.error("[submitReport] admin client init failed:", err);
    return {
      ok: false,
      error:
        "SERVER NOT CONFIGURED — Supabase env vars are missing. Check the deploy.",
    };
  }

  const ext = (() => {
    if (photo.type === "image/jpeg") return "jpg";
    if (photo.type === "image/png") return "png";
    if (photo.type === "image/webp") return "webp";
    if (photo.type === "image/heic") return "heic";
    if (photo.type === "image/heif") return "heif";
    return "bin";
  })();
  const objectKey = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`;

  const bytes = await photo.arrayBuffer();
  const uploadResult = await admin.storage
    .from(PHOTO_BUCKET)
    .upload(objectKey, bytes, {
      contentType: photo.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadResult.error) {
    console.error("[submitReport] upload error:", uploadResult.error.message);
    return {
      ok: false,
      error: "PHOTO UPLOAD FAILED — try again, or use a smaller image.",
    };
  }

  const { data: publicUrlData } = admin.storage.from(PHOTO_BUCKET).getPublicUrl(objectKey);
  const photo_url = publicUrlData.publicUrl;

  const insertResult = await admin
    .from("reports")
    .insert({
      photo_url,
      lat,
      lng,
      description,
      email_optional,
      neighborhood,
    })
    .select("id")
    .single();

  if (insertResult.error) {
    console.error("[submitReport] insert error:", insertResult.error.message);
    // Best-effort cleanup of the orphaned photo.
    await admin.storage.from(PHOTO_BUCKET).remove([objectKey]);
    return {
      ok: false,
      error: "COULD NOT SAVE REPORT — please try again in a moment.",
    };
  }

  revalidatePath("/");

  return { ok: true, id: insertResult.data.id };
}
