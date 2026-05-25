"use client";

import { useState } from "react";
import { formatCategory } from "@/features/spots/display";
import type { SpotCategory, SpotStatus } from "@/features/spots/types";

type Props = {
  spotId: string;
  category: SpotCategory;
  neighborhood: string | null;
  status: SpotStatus;
};

export function ShareActions({ spotId, category, neighborhood, status }: Props) {
  const [copied, setCopied] = useState(false);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (typeof window !== "undefined" ? window.location.origin : "");
  const pageUrl = `${siteUrl}/s/${spotId}`;

  const xText =
    status === "cleaned"
      ? `This spot in ${neighborhood ?? "Los Angeles"} was cleaned!`
      : `${formatCategory(category)} in ${neighborhood ?? "Los Angeles"} — help clean this up`;

  const xHref = `https://x.com/intent/post?text=${encodeURIComponent(xText)}&url=${encodeURIComponent(pageUrl)}`;

  const canShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  async function handleShare() {
    try {
      await navigator.share({ url: pageUrl });
    } catch {
      // User cancelled or share failed — no action needed
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — no action needed
    }
  }

  const btnClass =
    "border border-[#999999] bg-white py-[6px] px-[12px] text-[12px] font-bold uppercase tracking-[0.03em] text-[#001089] hover:bg-[#f8eac7] cursor-pointer";

  return (
    <div className="flex flex-wrap gap-[6px]">
      <a
        href={xHref}
        target="_blank"
        rel="noopener noreferrer"
        className={btnClass}
      >
        POST ON X
      </a>

      {canShare && (
        <button onClick={handleShare} className={btnClass}>
          SHARE
        </button>
      )}

      <button onClick={copyLink} className={btnClass}>
        {copied ? "COPIED!" : "COPY LINK"}
      </button>
    </div>
  );
}
