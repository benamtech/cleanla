import Link from "next/link";
import { redirect } from "next/navigation";
import { formatPoints } from "@/features/points/constants";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { UsernameForm } from "./UsernameForm";

export const dynamic = "force-dynamic";

type ProfileStats = {
  submitted_reports: number;
  verified_reports: number;
  cleanups_completed: number;
};

type LedgerRow = {
  id: string;
  entry_type: string;
  points: number;
  note: string | null;
  created_at: string;
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const admin = createAdminClient();
  const [statsResult, profileResult, balanceResult, ledgerResult] = await Promise.all([
    supabase.rpc("get_profile_contributions", { p_user_id: user.id }),
    supabase.from("profiles").select("username").eq("id", user.id).maybeSingle(),
    admin.rpc("get_user_point_balance", { p_user_id: user.id }),
    admin
      .from("point_ledger")
      .select("id, entry_type, points, note, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(8)
      .returns<LedgerRow[]>(),
  ]);

  const stats: ProfileStats =
    !statsResult.error && Array.isArray(statsResult.data) && statsResult.data[0]
      ? (statsResult.data[0] as ProfileStats)
      : { submitted_reports: 0, verified_reports: 0, cleanups_completed: 0 };

  const username =
    !profileResult.error && profileResult.data?.username
      ? String(profileResult.data.username)
      : null;
  const pointBalance = Number(balanceResult.data ?? 0);
  const ledger = ledgerResult.data ?? [];

  return (
    <main className="min-h-screen bg-white p-[18px]">
      <section className="mx-auto grid max-w-[720px] gap-[18px]">
        <div className="border border-[#999999]">
          <div className="flex h-[27px] items-center justify-between border-b border-[#999999] bg-[#94a3d6] px-[9px]">
            <h1 className="text-[15px] font-bold tracking-[0.03em] text-white uppercase">
              YOUR CONTRIBUTIONS
            </h1>
            <Link
              href="/"
              className="border border-white bg-white px-[6px] py-[3px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase hover:bg-[#f8eac7]"
            >
              [BACK TO MAP]
            </Link>
          </div>
          <div className="p-[9px]">
            <p className="text-[9px] tracking-[0.03em] text-[#001089] uppercase">
              {user.email}
              {username ? ` · @${username}` : " · ANONYMOUS"}
            </p>
          </div>
        </div>

        <UsernameForm initial={username} />

        <div className="grid gap-[9px] md:grid-cols-4">
          <div className="border border-[#999999] p-[18px]">
            <p className="text-[9px] font-bold tracking-[0.03em] text-[#999999] uppercase">
              POINT BALANCE
            </p>
            <p className="mt-[6px] text-[36px] font-bold leading-[36px] text-[#228B22]">
              {pointBalance}
            </p>
          </div>

          <div className="border border-[#999999] p-[18px]">
            <p className="text-[9px] font-bold tracking-[0.03em] text-[#999999] uppercase">
              SUBMITTED REPORTS
            </p>
            <p className="mt-[6px] text-[36px] font-bold leading-[36px] text-[#001089]">
              {stats.submitted_reports}
            </p>
          </div>

          <div className="border border-[#999999] p-[18px]">
            <p className="text-[9px] font-bold tracking-[0.03em] text-[#999999] uppercase">
              VERIFIED REPORTS
            </p>
            <p className="mt-[6px] text-[36px] font-bold leading-[36px] text-[#001089]">
              {stats.verified_reports}
            </p>
          </div>

          <div className="border border-[#999999] p-[18px]">
            <p className="text-[9px] font-bold tracking-[0.03em] text-[#999999] uppercase">
              CLEANUPS COMPLETED
            </p>
            <p className="mt-[6px] text-[36px] font-bold leading-[36px] text-[#228B22]">
              {stats.cleanups_completed}
            </p>
          </div>
        </div>

        <div className="border border-[#999999]">
          <div className="flex h-[27px] items-center justify-between border-b border-[#999999] bg-[#228B22] px-[9px]">
            <h2 className="text-[15px] font-bold tracking-[0.03em] text-white uppercase">
              POINT LEDGER
            </h2>
            <Link
              href="/rewards"
              className="border border-white bg-white px-[6px] py-[3px] text-[9px] font-bold tracking-[0.03em] text-[#228B22] uppercase hover:bg-[#f8eac7]"
            >
              [REWARDS]
            </Link>
          </div>
          {ledger.length === 0 ? (
            <p className="p-[9px] text-[9px] tracking-[0.03em] text-[#999999] uppercase">
              CLEAN VERIFIED SPOTS TO EARN POINTS. REWARDS START AT{" "}
              {formatPoints(200)}.
            </p>
          ) : (
            <table className="w-full border-collapse text-[9px] tracking-[0.03em] uppercase">
              <tbody>
                {ledger.map((entry) => (
                  <tr key={entry.id} className="border-b border-[#999999] last:border-b-0">
                    <td className="px-[9px] py-[6px] text-[#001089]">
                      {entry.entry_type.replaceAll("_", " ")}
                    </td>
                    <td
                      className={`px-[9px] py-[6px] text-right font-bold ${
                        entry.points > 0 ? "text-[#228B22]" : "text-[#a60315]"
                      }`}
                    >
                      {entry.points > 0 ? "+" : ""}
                      {formatPoints(entry.points)}
                    </td>
                    <td className="hidden px-[9px] py-[6px] text-right text-[#999999] sm:table-cell">
                      {new Date(entry.created_at).toISOString().slice(0, 10)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </main>
  );
}
