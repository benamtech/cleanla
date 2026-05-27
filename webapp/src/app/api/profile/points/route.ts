import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type LedgerRow = {
  id: string;
  entry_type: string;
  points: number;
  note: string | null;
  created_at: string;
};

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
  }

  const admin = createAdminClient();
  const [balanceResult, ledgerResult] = await Promise.all([
    admin.rpc("get_user_point_balance", { p_user_id: user.id }),
    admin
      .from("point_ledger")
      .select("id, entry_type, points, note, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20)
      .returns<LedgerRow[]>(),
  ]);

  if (balanceResult.error || ledgerResult.error) {
    return NextResponse.json({ error: "POINTS_FETCH_FAILED" }, { status: 500 });
  }

  return NextResponse.json({
    balance: Number(balanceResult.data ?? 0),
    ledger: ledgerResult.data ?? [],
  });
}
