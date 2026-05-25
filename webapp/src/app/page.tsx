import { ReportForm } from "@/components/ReportForm";
import { Feed } from "@/components/Feed";
import { listRecentReports } from "@/lib/reports/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const reports = await listRecentReports();

  return (
    <div className="min-h-screen bg-white">
      {/* Top program bar — 369 window-bar pattern. */}
      <header className="flex h-[27px] items-center justify-between border-b border-[#999999] bg-[#94a3d6] px-[9px]">
        <span className="text-[15px] font-bold uppercase tracking-[0.03em] text-white">
          [CLEANLA]
        </span>
        <span className="text-[9px] uppercase tracking-[0.03em] text-white">
          validation prototype · public
        </span>
      </header>

      <main className="mx-auto w-full max-w-[1200px] px-[12px] py-[18px]">
        {/* Hero */}
        <section className="mb-[24px] border border-[#999999] bg-[#f8eac7] p-[18px]">
          <h1 className="text-[24px] font-bold uppercase tracking-[0.03em] text-[#001089] sm:text-[30px]">
            show LA&rsquo;s dirty streets, in real time
          </h1>
          <p className="mt-[9px] max-w-[720px] text-[12px] leading-relaxed text-[#001089]">
            A public, transparent log of street issues across Los Angeles &mdash;
            encampments, illegal dumping, graffiti, biohazards, overgrown lots.
            Two taps from <em>I see a problem</em> to a public record.
            Reports are public by default. No login required.
          </p>
          <p className="mt-[9px] text-[9px] uppercase tracking-[0.03em] text-[#001089]">
            validation prototype · partnership conversation in progress · not a public launch
          </p>
        </section>

        {/* Two-column on desktop, stacked on mobile (auto-fit collapse per rule 8). */}
        <div
          className="grid gap-[18px]"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(312px, 1fr))" }}
        >
          <ReportForm />
          <Feed reports={reports} />
        </div>

        {/* Footer with CSV export and partnership context. */}
        <footer className="mt-[24px] border-t border-[#999999] pt-[12px]">
          <div className="flex flex-wrap items-center justify-between gap-[12px]">
            <div className="flex items-center gap-[12px]">
              <a
                href="/api/export.csv"
                className="border border-[#999999] bg-white px-[12px] py-[6px] text-[12px] font-bold uppercase tracking-[0.03em] text-[#001089] no-underline hover:bg-[#f8eac7]"
              >
                [DOWNLOAD CSV]
              </a>
              <span className="text-[9px] uppercase tracking-[0.03em] text-[#999999]">
                all reports · partnership handoff format
              </span>
            </div>
            <div className="flex items-center gap-[12px] text-[9px] uppercase tracking-[0.03em] text-[#999999]">
              <span>nonpartisan · public by default</span>
              <span>·</span>
              <a
                href="https://github.com/benamtech/cleanla"
                className="text-[#001089] no-underline hover:bg-[#f8eac7]"
              >
                [SOURCE]
              </a>
            </div>
          </div>
          <p className="mt-[9px] text-[9px] uppercase leading-relaxed tracking-[0.03em] text-[#999999]">
            for the official LA system, file at{" "}
            <a
              href="https://myla311.lacity.gov"
              className="text-[#001089] no-underline hover:bg-[#f8eac7]"
            >
              myla311.lacity.gov
            </a>
            . cleanla is a parallel transparency layer, not a replacement.
          </p>
        </footer>
      </main>
    </div>
  );
}
