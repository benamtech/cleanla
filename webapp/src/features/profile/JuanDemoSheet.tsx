"use client";

import Image from "next/image";
import { useState } from "react";

// Cosmetic demo profile for @Juan. All data here is mock — there is no real
// session behind it; nothing writes to Supabase. Rendered only when the home
// map is in DEMO_MODE (NEXT_PUBLIC_DEMO_MODE=true).

type ActivityRow = {
  id: string;
  title: string;
  category: string;
  neighborhood: string;
  location?: string;
  photo?: string;
  date: string;
  status: string;
};

const REPORTS: ActivityRow[] = [
  {
    id: "r1",
    title: "MATTRESS + CONSTRUCTION DEBRIS",
    category: "ILLEGAL DUMPING",
    neighborhood: "BOYLE HEIGHTS",
    location: "E 1ST ST & N SOTO ST",
    photo: "/report-r1.jpg",
    date: "2026-05-20",
    status: "Reported a mattress and construction debris blocking the curb lane on E 1st St. Flagged for city pickup; soft-held 5 minutes before going public.",
  },
  {
    id: "r2",
    title: "ALLEY-WALL GRAFFITI",
    category: "GRAFFITI",
    neighborhood: "HISTORIC FILIPINOTOWN",
    location: "TEMPLE ST & N HOOVER ST",
    photo: "/report-r2.jpg",
    date: "2026-05-22",
    status: "Fresh tagging on an alley-facing wall near the commercial strip. Photo verified, GPS within range.",
  },
  {
    id: "r3",
    title: "BUS-STOP TRASH OVERFLOW",
    category: "TRASH",
    neighborhood: "KOREATOWN",
    location: "WILSHIRE BLVD & S WESTERN AVE",
    photo: "/report-r3.jpg",
    date: "2026-05-25",
    status: "Overflowing bags around the bus stop and sidewalk tree well on Wilshire. Awaiting cleanup volunteer.",
  },
  {
    id: "r4",
    title: "FREEWAY-ADJACENT DEBRIS PILE",
    category: "ENCAMPMENT DEBRIS",
    neighborhood: "WESTLAKE",
    location: "S ALVARADO ST & W 7TH ST",
    photo: "/report-r4.jpg",
    date: "2026-05-27",
    status: "Abandoned debris pile along a freeway-adjacent sidewalk. Reported with location and photo.",
  },
];

const CLEANED: (ActivityRow & { points: number })[] = [
  {
    id: "c1",
    title: "SIDEWALK OVERGROWTH TRIMMED",
    category: "OVERGROWTH",
    neighborhood: "HIGHLAND PARK",
    date: "2026-05-21",
    points: 150,
    status: "Trimmed overgrown vegetation back from a sidewalk pinch point near a school route. Before/after verified.",
  },
  {
    id: "c2",
    title: "CORNER BAGS REMOVED",
    category: "TRASH",
    neighborhood: "LEIMERT PARK",
    date: "2026-05-24",
    points: 240,
    status: "Cleared bags from a corner after a weekend cleanup. Verified clean.",
  },
  {
    id: "c3",
    title: "RETAINING-WALL REPAINT",
    category: "GRAFFITI",
    neighborhood: "EAST HOLLYWOOD",
    date: "2026-05-26",
    points: 330,
    status: "Painted over tagging on a retaining wall visible from the sidewalk. Highest-value cleanup this month.",
  },
];

const TOTAL_POINTS = CLEANED.reduce((sum, row) => sum + row.points, 0);

const PROFILE = {
  name: "JUAN NAULA",
  handle: "@JUAN",
  location: "BOYLE HEIGHTS, LOS ANGELES",
  website: "cleanlawithme.org",
  socials: [
    {
      label: "INSTAGRAM",
      handle: "@cleanlawithme",
      url: "https://www.instagram.com/cleanlawithme/",
    },
    {
      label: "FACEBOOK",
      handle: "/cleanlawithme",
      url: "https://www.facebook.com/cleanlawithme/",
    },
  ],
};

export function JuanDemoSheet({ onClose }: { onClose: () => void }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  return (
    <div
      className="fixed inset-0 z-20 grid place-items-center"
      style={{
        paddingTop: "calc(9px + env(safe-area-inset-top))",
        paddingBottom: "calc(9px + env(safe-area-inset-bottom))",
        paddingLeft: "calc(9px + env(safe-area-inset-left))",
        paddingRight: "calc(9px + env(safe-area-inset-right))",
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Juan profile"
    >
      <aside
        className="max-h-full w-full max-w-[420px] overflow-auto border border-[#999999] bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* WINDOW BAR */}
        <div className="flex h-[27px] items-center justify-between border-b border-[#999999] bg-[#001089] px-[9px]">
          <h2 className="text-[15px] font-bold tracking-[0.03em] text-white uppercase">
            {PROFILE.handle}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="tap-45 flex h-[27px] min-w-[45px] items-center justify-center border border-white bg-white px-[9px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase hover:bg-[#f8eac7]"
            aria-label="Close profile"
          >
            [x]
          </button>
        </div>

        {/* STATUS STRIP — segmented counts, not floating chips */}
        <div className="flex h-[27px] items-stretch border-b border-[#999999]">
          <div className="flex flex-1 items-center justify-center bg-white px-[9px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase">
            {REPORTS.length} REPORTS
          </div>
          <div className="flex flex-1 items-center justify-center border-l border-[#999999] bg-white px-[9px] text-[9px] font-bold tracking-[0.03em] text-[#228B22] uppercase">
            {CLEANED.length} CLEANED
          </div>
          <div className="flex flex-1 items-center justify-center border-l border-[#999999] bg-white px-[9px] text-[9px] font-bold tracking-[0.03em] text-[#228B22] uppercase">
            {TOTAL_POINTS} PTS
          </div>
        </div>

        {/* IDENTITY — small avatar left of the name */}
        <div className="flex items-center gap-[9px] border-b border-[#999999] px-[9px] py-[9px]">
          <div className="relative h-[60px] w-[60px] shrink-0 border border-[#999999] bg-[#f8eac7]">
            <Image
              src="/cleanlawithme-logo.png"
              alt="Clean LA With Me logo"
              fill
              sizes="60px"
              className="object-contain p-[6px]"
            />
          </div>
          <div className="min-w-0">
            <h3 className="text-[18px] font-bold tracking-[0.03em] text-[#001089] uppercase">
              {PROFILE.name}
            </h3>
            <p className="text-[9px] font-bold tracking-[0.03em] text-[#999999] uppercase">
              {PROFILE.handle} · DEMO ACCOUNT
            </p>
          </div>
        </div>

        {/* ACCOUNT DATA */}
        <table className="w-full border-collapse">
          <tbody>
            <tr className="border-b border-[#999999]">
              <td className="w-[120px] border-r border-[#999999] bg-[#f8eac7] px-[9px] py-[6px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase align-top">
                LOCATION
              </td>
              <td className="px-[9px] py-[6px] text-[12px] leading-[18px] text-[#001089]">
                {PROFILE.location}
              </td>
            </tr>
            <tr className="border-b border-[#999999]">
              <td className="w-[120px] border-r border-[#999999] bg-[#f8eac7] px-[9px] py-[6px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase align-top">
                WEBSITE
              </td>
              <td className="px-[9px] py-[6px] text-[12px] leading-[18px] text-[#001089]">
                <a
                  href={`https://${PROFILE.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#001089]"
                >
                  {PROFILE.website}
                </a>
              </td>
            </tr>
            {PROFILE.socials.map((social) => (
              <tr key={social.label} className="border-b border-[#999999]">
                <td className="w-[120px] border-r border-[#999999] bg-[#f8eac7] px-[9px] py-[6px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase align-top">
                  {social.label}
                </td>
                <td className="px-[9px] py-[6px] text-[12px] leading-[18px] text-[#001089]">
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#001089]"
                  >
                    {social.handle}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* REPORTS — navy */}
        <div className="flex h-[27px] items-center border-b border-[#999999] bg-[#001089] px-[9px]">
          <span className="text-[12px] font-bold tracking-[0.03em] text-white uppercase">
            REPORTS · {REPORTS.length}
          </span>
        </div>
        {REPORTS.map((row) => {
          const isOpen = expanded.has(row.id);
          return (
            <div key={row.id}>
              <button
                type="button"
                onClick={() => toggle(row.id)}
                className="flex w-full items-stretch border-b border-[#999999] bg-white text-left hover:bg-[#f8eac7]"
                aria-expanded={isOpen}
              >
                <span className="w-[6px] shrink-0 bg-[#001089]" />
                <span className="relative my-[6px] ml-[6px] block h-[48px] w-[48px] shrink-0 overflow-hidden border border-[#999999] bg-[#f8eac7]">
                  {row.photo ? (
                    <Image
                      src={row.photo}
                      alt={row.title}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : null}
                </span>
                <span className="flex-1 px-[9px] py-[6px]">
                  <span className="block text-[12px] font-bold tracking-[0.03em] text-[#001089] uppercase">
                    {row.title}
                  </span>
                  <span className="block text-[9px] tracking-[0.03em] text-[#999999] uppercase">
                    {row.category} · {row.neighborhood}
                  </span>
                </span>
                <span className="flex w-[36px] shrink-0 items-center justify-center border-l border-[#999999] text-[12px] font-bold text-[#001089]">
                  {isOpen ? "[−]" : "[+]"}
                </span>
              </button>
              {isOpen ? (
                <div className="border-b border-[#999999] bg-[#f8eac7]">
                  {row.photo ? (
                    <div className="flex items-center justify-center border-b border-[#999999] bg-white py-[6px]">
                      <Image
                        src={row.photo}
                        alt={row.title}
                        width={640}
                        height={420}
                        sizes="(max-width: 420px) 100vw, 420px"
                        className="block h-auto max-h-[108px] w-auto max-w-full"
                      />
                    </div>
                  ) : (
                    <div className="flex h-[120px] items-center justify-center border-b border-[#999999] bg-white">
                      <span className="text-[9px] font-bold tracking-[0.03em] text-[#999999] uppercase">
                        PHOTO · {row.category}
                      </span>
                    </div>
                  )}
                  <div className="px-[9px] py-[9px]">
                    <p className="text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase">
                      LOCATION · {row.location}
                    </p>
                    <p className="mt-[6px] text-[9px] font-bold tracking-[0.03em] text-[#999999] uppercase">
                      {row.date} · REPORTED
                    </p>
                    <p className="mt-[6px] text-[12px] leading-[18px] text-[#001089]">
                      {row.status}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}

        {/* CLEANED — green */}
        <div className="flex h-[27px] items-center border-b border-[#999999] bg-[#228B22] px-[9px]">
          <span className="text-[12px] font-bold tracking-[0.03em] text-white uppercase">
            CLEANED · {CLEANED.length}
          </span>
        </div>
        {CLEANED.map((row) => {
          const isOpen = expanded.has(row.id);
          return (
            <div key={row.id}>
              <button
                type="button"
                onClick={() => toggle(row.id)}
                className="flex w-full items-stretch border-b border-[#999999] bg-white text-left hover:bg-[#f8eac7]"
                aria-expanded={isOpen}
              >
                <span className="w-[6px] shrink-0 bg-[#228B22]" />
                <span className="relative my-[6px] ml-[6px] block h-[48px] w-[48px] shrink-0 overflow-hidden border border-[#999999] bg-[#f8eac7]">
                  {row.photo ? (
                    <Image
                      src={row.photo}
                      alt={row.title}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : null}
                </span>
                <span className="flex-1 px-[9px] py-[6px]">
                  <span className="block text-[12px] font-bold tracking-[0.03em] text-[#001089] uppercase">
                    {row.title}
                  </span>
                  <span className="block text-[9px] tracking-[0.03em] text-[#999999] uppercase">
                    {row.category} · {row.neighborhood}
                  </span>
                </span>
                <span className="flex shrink-0 items-center justify-center border-l border-[#999999] px-[9px] text-[9px] font-bold tracking-[0.03em] text-[#228B22] uppercase">
                  +{row.points}
                </span>
                <span className="flex w-[36px] shrink-0 items-center justify-center border-l border-[#999999] text-[12px] font-bold text-[#228B22]">
                  {isOpen ? "[−]" : "[+]"}
                </span>
              </button>
              {isOpen ? (
                <div className="border-b border-[#999999] bg-[#f8eac7] px-[9px] py-[9px]">
                  <p className="text-[9px] font-bold tracking-[0.03em] text-[#999999] uppercase">
                    {row.date} · ✓ CLEANED · +{row.points} PTS
                  </p>
                  <p className="mt-[6px] text-[12px] leading-[18px] text-[#001089]">
                    {row.status}
                  </p>
                </div>
              ) : null}
            </div>
          );
        })}
      </aside>
    </div>
  );
}
