import { NextResponse } from "next/server";
import { parseOrganizationInput } from "@/features/organizations/validation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function requireOwner(orgId: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return { ok: false as const, status: 401, userId: null };

  const admin = createAdminClient();
  const { data: isOwner } = await admin.rpc("is_organization_owner", {
    p_org_id: orgId,
    p_user_id: user.id,
  });

  if (!isOwner) return { ok: false as const, status: 403, userId: user.id };
  return { ok: true as const, admin, userId: user.id };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orgId: string }> },
) {
  const { orgId } = await params;
  const owner = await requireOwner(orgId);
  if (!owner.ok) {
    return NextResponse.json(
      { error: owner.status === 401 ? "AUTH_REQUIRED" : "FORBIDDEN" },
      { status: owner.status },
    );
  }

  const [orgResult, rewardsResult, redemptionsResult, balanceResult] =
    await Promise.all([
      owner.admin.from("organizations").select("*").eq("id", orgId).single(),
      owner.admin
        .from("organization_rewards")
        .select("*")
        .eq("organization_id", orgId)
        .order("created_at", { ascending: false }),
      owner.admin
        .from("reward_redemptions")
        .select("id, claim_code, points, status, expires_at, created_at, organization_rewards(title)")
        .eq("organization_id", orgId)
        .order("created_at", { ascending: false })
        .limit(50),
      owner.admin.rpc("get_organization_point_balance", {
        p_organization_id: orgId,
      }),
    ]);

  if (orgResult.error) {
    return NextResponse.json({ error: "ORGANIZATION_NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json({
    organization: orgResult.data,
    rewards: rewardsResult.data ?? [],
    redemptions: redemptionsResult.data ?? [],
    balance: Number(balanceResult.data ?? 0),
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orgId: string }> },
) {
  const { orgId } = await params;
  const owner = await requireOwner(orgId);
  if (!owner.ok) {
    return NextResponse.json(
      { error: owner.status === 401 ? "AUTH_REQUIRED" : "FORBIDDEN" },
      { status: owner.status },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "BAD_JSON" }, { status: 400 });
  }

  const parsed = parseOrganizationInput(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  }

  const { error } = await owner.admin
    .from("organizations")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", orgId);

  if (error) {
    return NextResponse.json({ error: "ORGANIZATION_UPDATE_FAILED" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
