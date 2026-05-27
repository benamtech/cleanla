import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type RewardRow = {
  id: string;
  title: string;
  description: string;
  points_required: number;
  redemption_instructions: string | null;
  organizations: {
    id: string;
    name: string;
    business_category: string;
  } | null;
};

export async function GET() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("organization_rewards")
    .select(
      "id, title, description, points_required, redemption_instructions, organizations!inner(id, name, business_category)",
    )
    .eq("is_active", true)
    .eq("organizations.status", "approved")
    .order("points_required", { ascending: true })
    .returns<RewardRow[]>();

  if (error) {
    return NextResponse.json({ error: "REWARDS_FETCH_FAILED" }, { status: 500 });
  }

  return NextResponse.json({
    rewards: (data ?? []).filter((reward) => reward.organizations !== null),
  });
}
