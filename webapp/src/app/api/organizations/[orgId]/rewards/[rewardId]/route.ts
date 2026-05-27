import { NextResponse } from "next/server";
import { parseRewardInput } from "@/features/rewards/validation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orgId: string; rewardId: string }> },
) {
  const { orgId, rewardId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: isOwner } = await admin.rpc("is_organization_owner", {
    p_org_id: orgId,
    p_user_id: user.id,
  });

  if (!isOwner) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
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

  const { error } = await admin
    .from("organization_rewards")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", rewardId)
    .eq("organization_id", orgId);

  if (error) {
    return NextResponse.json({ error: "REWARD_UPDATE_FAILED" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
