import Link from "next/link";
import { redirect } from "next/navigation";
import { formatPoints } from "@/features/points/constants";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { ConfirmRedemptionForm, RewardCreateForm } from "./OrganizationDashboardActions";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ orgId: string }>;
};

export default async function OrganizationDashboardPage({ params }: Props) {
  const { orgId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const admin = createAdminClient();
  const { data: isOwner } = await admin.rpc("is_organization_owner", {
    p_org_id: orgId,
    p_user_id: user.id,
  });

  if (!isOwner) redirect("/organizations");

  const [orgResult, rewardsResult, redemptionsResult, balanceResult] =
    await Promise.all([
      admin.from("organizations").select("*").eq("id", orgId).single(),
      admin
        .from("organization_rewards")
        .select("*")
        .eq("organization_id", orgId)
        .order("created_at", { ascending: false }),
      admin
        .from("reward_redemptions")
        .select("id, claim_code, points, status, expires_at, created_at, organization_rewards(title)")
        .eq("organization_id", orgId)
        .order("created_at", { ascending: false })
        .limit(25),
      admin.rpc("get_organization_point_balance", { p_organization_id: orgId }),
    ]);

  if (orgResult.error || !orgResult.data) redirect("/organizations");

  const org = orgResult.data;
  const rewards = rewardsResult.data ?? [];
  const redemptions = redemptionsResult.data ?? [];
  const balance = Number(balanceResult.data ?? 0);

  return (
    <main className="min-h-screen bg-white p-[18px]">
      <section className="mx-auto grid max-w-[960px] gap-[18px]">
        <div className="border border-[#999999]">
          <div className="flex h-[27px] items-center justify-between border-b border-[#999999] bg-[#94a3d6] px-[9px]">
            <h1 className="text-[15px] font-bold tracking-[0.03em] text-white uppercase">
              {org.name}
            </h1>
            <Link
              href="/organizations"
              className="border border-white bg-white px-[6px] py-[3px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase"
            >
              [ORGS]
            </Link>
          </div>
          <div className="grid gap-[6px] p-[9px] text-[9px] tracking-[0.03em] text-[#001089] uppercase">
            <p>STATUS: {org.status}</p>
            <p>ORG POINTS: {formatPoints(balance)}</p>
            <p>{org.description}</p>
          </div>
        </div>

        {org.status === "approved" ? (
          <div className="grid gap-[9px] md:grid-cols-2">
            <RewardCreateForm orgId={orgId} />
            <ConfirmRedemptionForm orgId={orgId} />
          </div>
        ) : (
          <p className="border border-[#999999] p-[9px] text-[9px] font-bold tracking-[0.03em] text-[#999999] uppercase">
            REWARDS AND REDEMPTIONS UNLOCK AFTER ADMIN APPROVAL.
          </p>
        )}

        <div className="grid gap-[9px] md:grid-cols-2">
          <section className="border border-[#999999]">
            <div className="border-b border-[#999999] bg-[#f8eac7] px-[9px] py-[6px] text-[12px] font-bold text-[#001089] uppercase">
              REWARDS
            </div>
            {rewards.map((reward) => (
              <div key={reward.id} className="border-b border-[#999999] p-[9px] last:border-b-0">
                <p className="text-[12px] font-bold text-[#001089] uppercase">
                  {reward.title}
                </p>
                <p className="text-[9px] text-[#999999] uppercase">
                  {formatPoints(Number(reward.points_required))} /{" "}
                  {reward.is_active ? "ACTIVE" : "INACTIVE"}
                </p>
              </div>
            ))}
          </section>

          <section className="border border-[#999999]">
            <div className="border-b border-[#999999] bg-[#f8eac7] px-[9px] py-[6px] text-[12px] font-bold text-[#001089] uppercase">
              REDEMPTIONS
            </div>
            {redemptions.map((redemption) => (
              <div key={redemption.id} className="border-b border-[#999999] p-[9px] last:border-b-0">
                <p className="text-[12px] font-bold tracking-[0.12em] text-[#001089] uppercase">
                  {redemption.claim_code}
                </p>
                <p className="text-[9px] text-[#999999] uppercase">
                  {formatPoints(Number(redemption.points))} / {redemption.status}
                </p>
              </div>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}
