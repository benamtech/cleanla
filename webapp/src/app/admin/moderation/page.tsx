import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { pointsForCategory, formatPoints } from "@/features/points/constants";
import type { SpotCategory } from "@/features/spots/types";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { ModerationActions } from "./ModerationActions";

export const dynamic = "force-dynamic";

type QueueRow = {
  id: string;
  media_url: string | null;
  media_kind: string;
  verification_status: string;
  distance_from_spot_m: number | null;
  created_by: string | null;
  moderation_status: string;
  moderation_reason: string | null;
  created_at: string;
  spots: {
    category: string;
    description: string;
    status: string;
  } | null;
};

function statusColor(status: string) {
  if (status === "approved") return "#228B22";
  if (status === "rejected") return "#a60315";
  return "#c7a87d";
}

function filterRows(rows: QueueRow[], filter: string) {
  if (filter === "reports") {
    return rows.filter(
      (row) => row.media_kind === "report" || row.media_kind === "before",
    );
  }
  if (filter === "cleanups") {
    return rows.filter((row) => row.media_kind === "after");
  }
  if (filter === "rejected") {
    return rows.filter((row) => row.moderation_status === "rejected");
  }
  return rows;
}

export default async function ModerationQueuePage({
  searchParams,
}: {
  searchParams?: Promise<{ filter?: string }>;
}) {
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
    .select(
      "id, media_url, media_kind, verification_status, distance_from_spot_m, created_by, moderation_status, moderation_reason, created_at, spots(category, description, status)",
    )
    .in("moderation_status", ["pending", "rejected"])
    .order("created_at", { ascending: true })
    .returns<QueueRow[]>();

  const activeFilter = (await searchParams)?.filter ?? "all";
  const allRows = queue ?? [];
  const rows = filterRows(allRows, activeFilter);
  const counts = {
    all: allRows.length,
    reports: filterRows(allRows, "reports").length,
    cleanups: filterRows(allRows, "cleanups").length,
    rejected: filterRows(allRows, "rejected").length,
  };

  return (
    <div className="min-h-[100dvh] bg-white safe-top safe-x">
      <div className="flex h-[27px] items-center border-b border-[#999999] bg-[#94a3d6] px-[9px]">
        <span className="text-[15px] font-bold tracking-[0.03em] text-white uppercase">
          MODERATION QUEUE
        </span>
        <span className="ml-[9px] text-[12px] text-white opacity-75">
          {rows.length} ITEM{rows.length !== 1 ? "S" : ""} SHOWN
        </span>
      </div>

      <div className="p-[18px]">
        <nav className="mb-[9px] flex flex-wrap gap-[6px]">
          {(["all", "reports", "cleanups", "rejected"] as const).map((filter) => (
            <Link
              key={filter}
              href={`/admin/moderation?filter=${filter}`}
              className={`border border-[#999999] px-[9px] py-[6px] text-[9px] font-bold tracking-[0.03em] uppercase ${
                activeFilter === filter
                  ? "bg-[#001089] text-white"
                  : "bg-white text-[#001089] hover:bg-[#f8eac7]"
              }`}
            >
              [{filter} {counts[filter]}]
            </Link>
          ))}
        </nav>

        {rows.length === 0 ? (
          <div className="border border-[#999999] p-[18px] text-[12px] text-[#999999] uppercase">
            QUEUE IS EMPTY
          </div>
        ) : (
          <table className="w-full border-collapse border border-[#999999] text-[12px]">
            <thead>
              <tr className="bg-[#f8eac7]">
                {[
                  "PHOTO",
                  "KIND",
                  "REVIEW",
                  "VERIFY",
                  "CONSEQUENCE",
                  "DESCRIPTION",
                  "SUBMITTED",
                  "ACTION",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="border border-[#999999] p-[6px] text-left font-bold text-[#001089] uppercase"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const isCleanup = row.media_kind === "after";
                const isVerified = row.verification_status === "verified";
                const category = row.spots?.category as SpotCategory | undefined;
                const pointsPreview =
                  isCleanup && category ? pointsForCategory(category) : null;

                return (
                  <tr key={row.id} className="hover:bg-[#b8dae8]">
                    <td className="border border-[#999999] p-[6px]">
                      {row.media_url ? (
                        <Image
                          src={row.media_url}
                          alt=""
                          width={64}
                          height={64}
                          className="border border-[#999999] object-cover"
                          style={{ borderRadius: 0 }}
                        />
                      ) : (
                        <div className="grid h-[64px] w-[64px] place-items-center border border-[#999999] bg-[#f8eac7] text-[9px] text-[#999999] uppercase">
                          NONE
                        </div>
                      )}
                    </td>
                    <td className="border border-[#999999] p-[6px] text-[#001089] uppercase">
                      <strong>{row.media_kind}</strong>
                      <p className="mt-[3px] text-[9px] text-[#999999]">
                        {row.spots?.category ?? "UNKNOWN"}
                      </p>
                    </td>
                    <td
                      className="border border-[#999999] p-[6px] font-bold uppercase"
                      style={{ color: statusColor(row.moderation_status) }}
                    >
                      {row.moderation_status}
                      {row.moderation_reason ? (
                        <p className="mt-[3px] text-[9px] font-normal text-[#001089]">
                          {row.moderation_reason}
                        </p>
                      ) : null}
                    </td>
                    <td className="border border-[#999999] p-[6px] text-[#001089]">
                      <span
                        className={
                          isVerified
                            ? "font-bold text-[#228B22]"
                            : "font-bold text-[#c7a87d]"
                        }
                      >
                        {row.verification_status}
                      </span>
                      <p className="mt-[3px] text-[9px] text-[#999999]">
                        {row.distance_from_spot_m === null
                          ? "NO DISTANCE"
                          : `${Math.round(row.distance_from_spot_m)}M`}
                      </p>
                    </td>
                    <td className="max-w-[220px] border border-[#999999] p-[6px] text-[#001089]">
                      {isCleanup ? (
                        isVerified ? (
                          <span className="font-bold text-[#228B22] uppercase">
                            APPROVE = CLEANED + {formatPoints(pointsPreview ?? 0)}
                          </span>
                        ) : (
                          <span className="font-bold text-[#a60315] uppercase">
                            APPROVE = MEDIA ONLY / NO POINTS
                          </span>
                        )
                      ) : (
                        <span className="font-bold uppercase">
                          APPROVE = PUBLISH MEDIA
                        </span>
                      )}
                      <p className="mt-[3px] text-[9px] text-[#999999] uppercase">
                        SPOT {row.spots?.status ?? "UNKNOWN"}
                      </p>
                    </td>
                    <td className="max-w-[240px] border border-[#999999] p-[6px] text-[#001089]">
                      {row.spots?.description ?? (
                        <span className="text-[#999999]">NONE</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap border border-[#999999] p-[6px] text-[#999999]">
                      {new Date(row.created_at)
                        .toISOString()
                        .slice(0, 16)
                        .replace("T", " ")}
                    </td>
                    <td className="border border-[#999999] p-[6px]">
                      <ModerationActions
                        mediaId={row.id}
                        currentStatus={row.moderation_status}
                        isCleanup={isCleanup}
                        isVerified={isVerified}
                        pointsPreview={pointsPreview}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
