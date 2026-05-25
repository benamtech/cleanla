import { createClient } from "@/lib/supabase/server";
import type { Report } from "./types";

/**
 * Fetches the most recent reports for the public feed. Limited so the page
 * stays cheap to render on the validation prototype. Pagination is deferred
 * to v1.1 — at MVP scale (zero users), 100 rows is more than enough.
 */
export async function listRecentReports(limit = 100): Promise<Report[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("[reports.listRecentReports] supabase error:", error.message);
      return [];
    }

    return (data ?? []) as Report[];
  } catch (err) {
    // Surfacing this as an empty feed (rather than throwing) so the landing
    // page renders even when Supabase isn't configured — the validation
    // prototype is meant to be demonstrable in any env.
    console.error("[reports.listRecentReports] unexpected error:", err);
    return [];
  }
}

/**
 * Fetches ALL reports for CSV export. Unbounded by design — the export is
 * the partnership artifact (one-click handoff to Naula's ops team). If the
 * dataset grows large, this becomes a streaming response in v1.1.
 */
export async function listAllReports(): Promise<Report[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[reports.listAllReports] supabase error:", error.message);
      return [];
    }

    return (data ?? []) as Report[];
  } catch (err) {
    console.error("[reports.listAllReports] unexpected error:", err);
    return [];
  }
}
