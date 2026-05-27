import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ redemptionId: string }> },
) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
  }

  let reason = "canceled";
  try {
    const body = (await request.json()) as { reason?: unknown };
    if (typeof body.reason === "string" && body.reason.trim()) {
      reason = body.reason.trim();
    }
  } catch {
    // Empty body is fine.
  }

  const { redemptionId } = await params;
  const admin = createAdminClient();
  const { data, error } = await admin.rpc("cancel_reward_redemption", {
    p_actor_id: user.id,
    p_redemption_id: redemptionId,
    p_reason: reason,
  });

  if (error || !data?.[0]) {
    const message = error?.message ?? "CANCEL_FAILED";
    if (message.includes("FORBIDDEN")) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }
    if (message.includes("REDEMPTION_NOT_PENDING")) {
      return NextResponse.json({ error: "REDEMPTION_NOT_PENDING" }, { status: 409 });
    }
    return NextResponse.json({ error: "CANCEL_FAILED" }, { status: 500 });
  }

  return NextResponse.json(data[0]);
}
