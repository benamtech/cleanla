import { listAllReports } from "@/lib/reports/queries";

/**
 * One-click CSV export. The partnership handoff format — drops directly into
 * a spreadsheet that Naula's ops team or city contact can ingest. No auth on
 * the validation prototype; if the data needs to become private later, this
 * is where a token check would go.
 */
export const dynamic = "force-dynamic";

function escapeCsvCell(value: string | number | null): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  // Quote if contains comma, quote, newline, or carriage return; double internal quotes.
  if (/[,"\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET() {
  const reports = await listAllReports();

  const header = [
    "id",
    "created_at",
    "neighborhood",
    "lat",
    "lng",
    "description",
    "photo_url",
    "email_optional",
  ];

  const rows = reports.map((r) =>
    [
      r.id,
      r.created_at,
      r.neighborhood,
      r.lat,
      r.lng,
      r.description,
      r.photo_url,
      r.email_optional,
    ]
      .map(escapeCsvCell)
      .join(","),
  );

  const csv = [header.join(","), ...rows].join("\n") + "\n";
  const today = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="cleanla-reports-${today}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
