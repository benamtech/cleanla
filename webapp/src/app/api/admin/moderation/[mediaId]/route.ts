import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type ModerationAction = "approved" | "rejected";

type MediaForFinalization = {
  id: string;
  spot_id: string;
  media_kind: string;
  verification_status: string;
  created_by: string | null;
  spots: {
    status: string;
  } | null;
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ mediaId: string }> },
) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: profile } = await admin
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  let body: { action?: unknown; reason?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const { action, reason } = body;

  if (action !== "approved" && action !== "rejected") {
    return NextResponse.json({ error: "INVALID_ACTION" }, { status: 400 });
  }

  const { mediaId } = await params;

  const { data: media } = await admin
    .from("spot_media")
    .select("id, spot_id, media_kind, verification_status, created_by, spots(status)")
    .eq("id", mediaId)
    .single<MediaForFinalization>();

  const { error } = await admin
    .from("spot_media")
    .update({
      moderation_status: action as ModerationAction,
      moderation_reason: typeof reason === "string" ? reason : null,
      moderated_by: user.id,
      moderated_at: new Date().toISOString(),
    })
    .eq("id", mediaId);

  if (error) {
    return NextResponse.json({ error: "DATABASE_FAILURE" }, { status: 500 });
  }

  if (
    action === "approved" &&
    media?.media_kind === "after" &&
    media.verification_status === "verified" &&
    media.created_by &&
    media.spots?.status !== "cleaned" &&
    media.spots?.status !== "hidden"
  ) {
    const fromStatus = media.spots?.status ?? null;
    const { error: spotUpdateError } = await admin
      .from("spots")
      .update({ status: "cleaned", updated_at: new Date().toISOString() })
      .eq("id", media.spot_id);

    if (!spotUpdateError) {
      const { data: contribution, error: contributionError } = await admin
        .from("contribution_history")
        .insert({
          spot_id: media.spot_id,
          actor_id: media.created_by,
          action: "cleanup_submitted",
          from_status: fromStatus,
          to_status: "cleaned",
          spot_media_id: media.id,
        })
        .select("id")
        .single();

      if (!contributionError && contribution?.id) {
        const { error: awardError } = await admin.rpc("award_cleanup_points", {
          p_user_id: media.created_by,
          p_spot_id: media.spot_id,
          p_spot_media_id: media.id,
          p_contribution_history_id: contribution.id,
        });

        if (awardError) {
          console.error("[admin moderation] point award failed:", awardError);
        }
      } else if (contributionError) {
        console.error(
          "[admin moderation] contribution insert failed:",
          contributionError,
        );
      }
    } else {
      console.error("[admin moderation] spot cleanup update failed:", spotUpdateError);
    }
  }

  return NextResponse.json({ ok: true });
}
