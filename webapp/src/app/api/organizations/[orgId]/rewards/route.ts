import { NextResponse } from "next/server";
import { parseRewardInput } from "@/features/rewards/validation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orgId: string }> },
) {
  const { orgId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
  }

  const admin = createAdminClient();
  const [{ data: isOwner }, { data: org }] = await Promise.all([
    admin.rpc("is_organization_owner", { p_org_id: orgId, p_user_id: user.id }),
    admin.from("organizations").select("status").eq("id", orgId).single(),
  ]);

  if (!isOwner) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }
  if (org?.status !== "approved") {
    return NextResponse.json({ error: "ORGANIZATION_NOT_APPROVED" }, { status: 409 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "BAD_JSON" }, { status: 400 });
  }

  const parsed = parseRewardInput(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  }

  const { data, error } = await admin
    .from("organization_rewards")
    .insert({
      ...parsed.data,
      organization_id: orgId,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "REWARD_CREATE_FAILED" }, { status: 500 });
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}
