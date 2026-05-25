import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

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
  const { data, error } = await admin.rpc("get_profile_contributions", {
    p_user_id: user.id,
  });

  if (error || !data?.[0]) {
    return NextResponse.json({ error: "STATS_FETCH_FAILED" }, { status: 500 });
  }

  const row = data[0] as {
    submitted_reports: number;
    verified_reports: number;
    cleanups_completed: number;
  };

  return NextResponse.json({
    submitted_reports: row.submitted_reports,
    verified_reports: row.verified_reports,
    cleanups_completed: row.cleanups_completed,
  });
}
