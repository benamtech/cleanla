import { NextResponse } from "next/server";
import { isApprovedStatusAction } from "@/features/organizations/validation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orgId: string }> },
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

  let body: { action?: unknown; note?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "BAD_JSON" }, { status: 400 });
  }

  if (!isApprovedStatusAction(body.action)) {
    return NextResponse.json({ error: "INVALID_ACTION" }, { status: 400 });
  }

  const { orgId } = await params;
  const { error } = await admin
    .from("organizations")
    .update({
      status: body.action,
      admin_note: typeof body.note === "string" ? body.note.trim() || null : null,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", orgId);

  if (error) {
    return NextResponse.json({ error: "ORGANIZATION_REVIEW_FAILED" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
