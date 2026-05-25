import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type ModerationAction = "approved" | "rejected";

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

  return NextResponse.json({ ok: true });
}
