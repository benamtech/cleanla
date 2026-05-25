import type { Report } from "@/lib/reports/types";

function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function formatCoords(lat: number, lng: number): string {
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

export function Feed({ reports }: { reports: Report[] }) {
  if (reports.length === 0) {
    return (
      <div className="border border-[#999999] bg-[#f8eac7] p-[18px] text-center">
        <p className="text-[12px] uppercase tracking-[0.03em] text-[#001089]">
          no reports yet · be the first
        </p>
      </div>
    );
  }

  return (
    <div className="border border-[#999999] bg-white">
      <div className="flex items-center justify-between border-b border-[#999999] bg-[#94a3d6] px-[9px] py-[6px]">
        <h2 className="text-[15px] font-bold uppercase tracking-[0.03em] text-white">
          public feed
        </h2>
        <span className="text-[9px] uppercase tracking-[0.03em] text-white">
          {reports.length} report{reports.length === 1 ? "" : "s"} · newest first
        </span>
      </div>
      <ul className="divide-y divide-[#999999]">
        {reports.map((r) => (
          <li key={r.id} className="grid grid-cols-[120px_1fr] gap-[12px] p-[12px]">
            <div className="border border-[#999999] bg-[#f8eac7]">
              {/* Photos are served from a public Supabase bucket. We deliberately
                  do not run Next.js image optimization on them — keeps the
                  prototype's infra surface minimal. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={r.photo_url}
                alt={r.description}
                loading="lazy"
                className="block aspect-square w-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <p className="text-[12px] text-[#001089]">{r.description}</p>
              <div className="flex flex-wrap items-center gap-x-[12px] gap-y-[3px] text-[9px] uppercase tracking-[0.03em] text-[#999999]">
                <span>{formatTimestamp(r.created_at)}</span>
                {r.neighborhood ? <span>· {r.neighborhood}</span> : null}
                <span>· {formatCoords(r.lat, r.lng)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
