"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  mediaId: string;
  currentStatus: string;
};

export function ModerationActions({ mediaId, currentStatus }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function act(action: "approved" | "rejected") {
    setBusy(true);
    await fetch(`/api/admin/moderation/${mediaId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    router.refresh();
    setBusy(false);
  }

  if (currentStatus === "approved") {
    return (
      <div className="flex gap-[6px]">
        <span className="text-[12px] text-[#228B22] font-bold uppercase">APPROVED</span>
        <button
          onClick={() => act("rejected")}
          disabled={busy}
          className="border border-[#999999] bg-white py-[6px] px-[12px] text-[12px] font-bold text-[#a60315] uppercase disabled:opacity-50 hover:bg-[#f8eac7] cursor-pointer"
        >
          REJECT
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-[6px]">
      <button
        onClick={() => act("approved")}
        disabled={busy}
        className="border border-[#999999] bg-white py-[6px] px-[12px] text-[12px] font-bold text-[#228B22] uppercase disabled:opacity-50 hover:bg-[#f8eac7] cursor-pointer"
      >
        APPROVE
      </button>
      <button
        onClick={() => act("rejected")}
        disabled={busy}
        className="border border-[#999999] bg-white py-[6px] px-[12px] text-[12px] font-bold text-[#a60315] uppercase disabled:opacity-50 hover:bg-[#f8eac7] cursor-pointer"
      >
        REJECT
      </button>
    </div>
  );
}
