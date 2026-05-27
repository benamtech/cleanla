import { NextResponse } from "next/server";
import { generateClaimCode } from "@/features/rewards/claim-code";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type ClaimResult = {
  redemption_id: string;
  claim_code: string;
  points: number;
  expires_at: string;
  point_balance: number;
};

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ rewardId: string }> },
) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
  }

  const { rewardId } = await params;
  const admin = createAdminClient();

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const { data, error } = await admin.rpc("claim_reward", {
      p_user_id: user.id,
      p_reward_id: rewardId,
      p_claim_code: generateClaimCode(),
    });

    if (!error && data?.[0]) {
      return NextResponse.json(data[0] as ClaimResult);
    }

    if (error?.code === "23505") continue;

    const message = error?.message ?? "CLAIM_FAILED";
    if (message.includes("INSUFFICIENT_POINTS")) {
      return NextResponse.json({ error: "INSUFFICIENT_POINTS" }, { status: 409 });
    }
    if (message.includes("REWARD_NOT_AVAILABLE")) {
      return NextResponse.json({ error: "REWARD_NOT_AVAILABLE" }, { status: 404 });
    }
    return NextResponse.json({ error: "CLAIM_FAILED" }, { status: 500 });
  }

  return NextResponse.json({ error: "CLAIM_CODE_COLLISION" }, { status: 500 });
}
