import { NextResponse } from "next/server";
import { normalizeClaimCode } from "@/features/rewards/validation";
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "BAD_JSON" }, { status: 400 });
  }

  const claimCode =
    typeof body === "object" && body !== null && "claim_code" in body
      ? normalizeClaimCode((body as { claim_code: unknown }).claim_code)
      : null;

  if (!claimCode) {
    return NextResponse.json({ error: "CLAIM_CODE_REQUIRED" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin.rpc("confirm_reward_redemption", {
    p_actor_id: user.id,
    p_organization_id: orgId,
    p_claim_code: claimCode,
  });

  if (error || !data?.[0]) {
    const message = error?.message ?? "CONFIRM_FAILED";
    if (message.includes("FORBIDDEN")) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }
    if (message.includes("REDEMPTION_NOT_AVAILABLE")) {
      return NextResponse.json({ error: "REDEMPTION_NOT_AVAILABLE" }, { status: 404 });
    }
    return NextResponse.json({ error: "CONFIRM_FAILED" }, { status: 500 });
  }

  return NextResponse.json(data[0]);
}
