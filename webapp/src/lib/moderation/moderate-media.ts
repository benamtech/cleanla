import Anthropic from "@anthropic-ai/sdk";
import type { SupabaseClient } from "@supabase/supabase-js";

type ModerateMediaInput = {
  spotMediaId: string;
  category: string;
  imageUrl: string;
};

export type ModerateMediaResult =
  | { status: "approved"; reason: null }
  | { status: "rejected"; reason: string }
  | {
      status: "pending";
      reason: "manual_review_required" | "ai_parse_error" | "ai_call_error";
    };

const SYSTEM_PROMPT = `You are a content moderator for CleanLA, a civic app where users photograph
public blight in Los Angeles. All photos are taken outdoors in public spaces.

The user's claimed category: {category}

Respond with JSON only — no explanation, no markdown:
{
  "approved": true | false,
  "reason": "one short phrase if rejected, null if approved",
  "category_match": true | false
}

Approve if: an outdoor photo plausibly showing civic blight — trash, graffiti,
illegal dumping, overgrowth, encampment debris, or biohazard — even if minor.

Reject if: blank or black image, screenshot of a screen, photo of a photo,
completely unrelated to outdoor civic conditions, or intentionally offensive content.`;

export async function moderateMedia(
  admin: SupabaseClient,
  input: ModerateMediaInput,
): Promise<ModerateMediaResult> {
  if (process.env.CLEANLA_AI_REVIEW_ENABLED !== "true") {
    return await applyResult(
      admin,
      input.spotMediaId,
      "pending",
      "manual_review_required",
      false,
    );
  }

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 256,
      system: SYSTEM_PROMPT.replace("{category}", input.category),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "url", url: input.imageUrl },
            },
            { type: "text", text: "Evaluate this photo." },
          ],
        },
      ],
    });

    const raw = message.content[0];
    if (raw.type !== "text") {
      return await applyResult(admin, input.spotMediaId, "pending", "ai_parse_error");
    }

    let parsed: { approved: unknown; reason: unknown };
    try {
      parsed = JSON.parse(raw.text);
    } catch {
      return await applyResult(admin, input.spotMediaId, "pending", "ai_parse_error");
    }

    if (typeof parsed.approved !== "boolean") {
      return await applyResult(admin, input.spotMediaId, "pending", "ai_parse_error");
    }

    if (parsed.approved) {
      return await applyResult(admin, input.spotMediaId, "approved", null);
    }

    const reason =
      typeof parsed.reason === "string" && parsed.reason.trim()
        ? parsed.reason.trim()
        : "rejected_by_ai";
    return await applyResult(admin, input.spotMediaId, "rejected", reason);
  } catch {
    // Never throw — leave media in pending so the human queue catches it
    try {
      await admin
        .from("spot_media")
        .update({ moderation_reason: "ai_call_error" })
        .eq("id", input.spotMediaId);
    } catch {
      // intentionally empty
    }
    return { status: "pending", reason: "ai_call_error" };
  }
}

async function applyResult(
  admin: SupabaseClient,
  spotMediaId: string,
  status: "approved" | "rejected" | "pending",
  reason: string | null,
  stampModeratedAt = true,
): Promise<ModerateMediaResult> {
  const update: Record<string, unknown> = {
    moderation_status: status,
    moderation_reason: reason,
  };
  if (stampModeratedAt) {
    update.moderated_at = new Date().toISOString();
  }

  const { error } = await admin.from("spot_media").update(update).eq("id", spotMediaId);

  if (error) throw new Error("spot_media_moderation_update_failed");

  if (status === "approved") return { status: "approved", reason: null };
  if (status === "rejected") return { status: "rejected", reason: reason ?? "rejected_by_ai" };
  return {
    status: "pending",
    reason:
      (reason as "manual_review_required" | "ai_parse_error" | "ai_call_error") ??
      "ai_call_error",
  };
}
