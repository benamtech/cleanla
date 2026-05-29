import Link from "next/link";
import { formatPoints } from "@/features/points/constants";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { ClaimRewardButton } from "./ClaimRewardButton";

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

export default async function RewardsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const admin = createAdminClient();

  const [rewardsResult, balanceResult] = await Promise.all([
    admin
      .from("organization_rewards")
      .select(
        "id, title, description, points_required, redemption_instructions, organizations!inner(id, name, business_category)",
      )
      .eq("is_active", true)
      .eq("organizations.status", "approved")
      .order("points_required", { ascending: true })
      .returns<RewardRow[]>(),
    user
      ? admin.rpc("get_user_point_balance", { p_user_id: user.id })
      : Promise.resolve({ data: 0, error: null }),
  ]);

  const rewards = (rewardsResult.data ?? []).filter(
    (reward) => reward.organizations !== null,
  );
  const balance = Number(balanceResult.data ?? 0);

  return (
    <main className="min-h-[100dvh] bg-white pt-[calc(18px_+_env(safe-area-inset-top))] pr-[calc(18px_+_env(safe-area-inset-right))] pb-[calc(18px_+_env(safe-area-inset-bottom))] pl-[calc(18px_+_env(safe-area-inset-left))]">
      <section className="mx-auto grid max-w-[900px] gap-[18px]">
        <div className="border border-[#999999]">
          <div className="flex h-[27px] items-center justify-between border-b border-[#999999] bg-[#228B22] px-[9px]">
            <h1 className="text-[15px] font-bold tracking-[0.03em] text-white uppercase">
              LOCAL REWARDS
            </h1>
            <Link
              href="/"
              className="border border-white bg-white px-[6px] py-[3px] text-[9px] font-bold tracking-[0.03em] text-[#228B22] uppercase hover:bg-[#f8eac7]"
            >
              [MAP]
            </Link>
          </div>
          <div className="p-[9px] text-[9px] tracking-[0.03em] text-[#001089] uppercase">
            {user
              ? `POINT BALANCE: ${formatPoints(balance)}`
              : "SIGN IN TO CLAIM REWARDS. CLEAN VERIFIED SPOTS TO EARN POINTS."}
          </div>
        </div>

        <div className="grid gap-[9px] md:grid-cols-2">
          {rewards.map((reward) => (
            <article key={reward.id} className="grid gap-[9px] border border-[#999999] p-[9px]">
              {(() => {
                const needed = Math.max(0, reward.points_required - balance);
                const canClaim = Boolean(user) && needed === 0;
                return (
                  <>
              <div>
                <p className="text-[9px] font-bold tracking-[0.03em] text-[#999999] uppercase">
                  {reward.organizations?.name} / {reward.organizations?.business_category}
                </p>
                <h2 className="text-[18px] font-bold tracking-[0.03em] text-[#001089] uppercase">
                  {reward.title}
                </h2>
              </div>
              <p className="text-[12px] leading-[18px] text-[#001089]">
                {reward.description}
              </p>
              <p className="text-[15px] font-bold text-[#228B22] uppercase">
                {formatPoints(reward.points_required)}
              </p>
              {user ? (
                <p
                  className={`text-[9px] font-bold tracking-[0.03em] uppercase ${
                    canClaim ? "text-[#228B22]" : "text-[#a60315]"
                  }`}
                >
                  {canClaim
                    ? "AVAILABLE WITH YOUR BALANCE"
                    : `NEED ${formatPoints(needed)} MORE`}
                </p>
              ) : null}
              {user ? (
                <ClaimRewardButton
                  rewardId={reward.id}
                  canClaim={canClaim}
                  disabledReason={
                    canClaim ? null : `NEED ${formatPoints(needed)} MORE`
                  }
                />
              ) : (
                <Link
                  href="/"
                  className="inline-flex min-h-[45px] items-center justify-center border border-[#999999] bg-white px-[9px] py-[6px] text-center text-[12px] font-bold tracking-[0.03em] text-[#001089] uppercase hover:bg-[#f8eac7]"
                >
                  [SIGN IN ON MAP]
                </Link>
              )}
                  </>
                );
              })()}
            </article>
          ))}
        </div>

        {rewards.length === 0 ? (
          <p className="border border-[#999999] p-[18px] text-[12px] tracking-[0.03em] text-[#999999] uppercase">
            NO ACTIVE REWARDS YET.
          </p>
        ) : null}
      </section>
    </main>
  );
}
