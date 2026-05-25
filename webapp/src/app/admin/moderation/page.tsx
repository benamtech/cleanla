import { redirect } from "next/navigation";
import Image from "next/image";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { ModerationActions } from "./ModerationActions";

export const dynamic = "force-dynamic";

type QueueRow = {
  id: string;
  media_url: string | null;
  media_kind: string;
  moderation_status: string;
  moderation_reason: string | null;
  created_at: string;
  spots: {
    category: string;
    description: string;
  } | null;
};

function statusColor(status: string) {
  if (status === "approved") return "#228B22";
  if (status === "rejected") return "#a60315";
  return "#c7a87d"; // pending — amberSand
}

export default async function ModerationQueuePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) redirect("/");

  const { data: queue } = await admin
    .from("spot_media")
    .select("id, media_url, media_kind, moderation_status, moderation_reason, created_at, spots(category, description)")
    .in("moderation_status", ["pending", "rejected"])
    .order("created_at", { ascending: true })
    .returns<QueueRow[]>();

  const rows = queue ?? [];

  return (
    <div className="min-h-screen bg-white">
      {/* Window bar */}
      <div className="h-[27px] flex items-center px-[9px] bg-[#94a3d6] border-b border-[#999999]">
        <span className="text-[15px] text-white font-bold uppercase tracking-[0.03em]">
          MODERATION QUEUE
        </span>
        <span className="ml-[9px] text-[12px] text-white opacity-75">
          {rows.length} ITEM{rows.length !== 1 ? "S" : ""} PENDING REVIEW
        </span>
      </div>

      <div className="p-[18px]">
        {rows.length === 0 ? (
          <div className="border border-[#999999] p-[18px] text-[12px] text-[#999999] uppercase">
            QUEUE IS EMPTY — ALL MEDIA REVIEWED
          </div>
        ) : (
          <table className="w-full border-collapse border border-[#999999] text-[12px]">
            <thead>
              <tr className="bg-[#f8eac7]">
                <th className="border border-[#999999] p-[6px] text-left font-bold text-[#001089] uppercase w-[54px]">
                  PHOTO
                </th>
                <th className="border border-[#999999] p-[6px] text-left font-bold text-[#001089] uppercase">
                  CATEGORY
                </th>
                <th className="border border-[#999999] p-[6px] text-left font-bold text-[#001089] uppercase">
                  KIND
                </th>
                <th className="border border-[#999999] p-[6px] text-left font-bold text-[#001089] uppercase">
                  STATUS
                </th>
                <th className="border border-[#999999] p-[6px] text-left font-bold text-[#001089] uppercase">
                  AI REASON
                </th>
                <th className="border border-[#999999] p-[6px] text-left font-bold text-[#001089] uppercase">
                  DESCRIPTION
                </th>
                <th className="border border-[#999999] p-[6px] text-left font-bold text-[#001089] uppercase">
                  SUBMITTED
                </th>
                <th className="border border-[#999999] p-[6px] text-left font-bold text-[#001089] uppercase">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-[#b8dae8]">
                  <td className="border border-[#999999] p-[6px]">
                    {row.media_url ? (
                      <Image
                        src={row.media_url}
                        alt=""
                        width={48}
                        height={48}
                        className="object-cover border border-[#999999]"
                        style={{ borderRadius: 0 }}
                      />
                    ) : (
                      <div
                        className="border border-[#999999] bg-[#f8eac7] text-[9px] text-[#999999] uppercase flex items-center justify-center"
                        style={{ width: 48, height: 48 }}
                      >
                        NONE
                      </div>
                    )}
                  </td>
                  <td className="border border-[#999999] p-[6px] text-[#001089] uppercase font-bold">
                    {row.spots?.category ?? "—"}
                  </td>
                  <td className="border border-[#999999] p-[6px] text-[#001089] uppercase">
                    {row.media_kind}
                  </td>
                  <td className="border border-[#999999] p-[6px] font-bold uppercase" style={{ color: statusColor(row.moderation_status) }}>
                    {row.moderation_status}
                  </td>
                  <td className="border border-[#999999] p-[6px] text-[#001089] max-w-[180px]">
                    {row.moderation_reason ?? <span className="text-[#999999]">—</span>}
                  </td>
                  <td className="border border-[#999999] p-[6px] text-[#001089] max-w-[240px]">
                    {row.spots?.description ?? <span className="text-[#999999]">—</span>}
                  </td>
                  <td className="border border-[#999999] p-[6px] text-[#999999] whitespace-nowrap">
                    {new Date(row.created_at).toISOString().slice(0, 16).replace("T", " ")}
                  </td>
                  <td className="border border-[#999999] p-[6px]">
                    <ModerationActions mediaId={row.id} currentStatus={row.moderation_status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
