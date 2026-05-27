"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function OrganizationReviewActions({ orgId }: { orgId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function act(action: "approved" | "rejected") {
    setBusy(true);
    await fetch(`/api/admin/organizations/${orgId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    router.refresh();
    setBusy(false);
  }

  return (
    <div className="flex gap-[6px]">
      <button
        type="button"
        onClick={() => act("approved")}
        disabled={busy}
        className="border border-[#999999] bg-white px-[9px] py-[6px] text-[12px] font-bold text-[#228B22] uppercase disabled:opacity-50"
      >
        APPROVE
      </button>
      <button
        type="button"
        onClick={() => act("rejected")}
        disabled={busy}
        className="border border-[#999999] bg-white px-[9px] py-[6px] text-[12px] font-bold text-[#a60315] uppercase disabled:opacity-50"
      >
        REJECT
      </button>
    </div>
  );
}
