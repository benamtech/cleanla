"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  mediaId: string;
  currentStatus: string;
  isCleanup: boolean;
  isVerified: boolean;
  pointsPreview: number | null;
};

export function ModerationActions({
  mediaId,
  currentStatus,
  isCleanup,
  isVerified,
  pointsPreview,
}: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function act(action: "approved" | "rejected") {
    setBusy(true);
    const response = await fetch(`/api/admin/moderation/${mediaId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const payload = (await response.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    if (response.ok && payload.cleanup_finalized === true) {
      setResult(
        `CLEANUP FINALIZED / +${String(payload.points_awarded ?? 0)} POINTS`,
      );
    }
    router.refresh();
    setBusy(false);
    setConfirming(false);
  }

  function requestApprove() {
    if (isCleanup) {
      setConfirming(true);
      return;
    }
    void act("approved");
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
    <div className="grid gap-[6px]">
      {confirming ? (
        <div className="grid gap-[6px] border border-[#228B22] bg-white p-[6px]">
          <p className="text-[9px] font-bold tracking-[0.03em] text-[#228B22] uppercase">
            {isVerified
              ? `APPROVE CLEANUP / MARK CLEANED / AWARD ${pointsPreview ?? 0} POINTS`
              : "CLEANUP IS NOT LOCATION-VERIFIED. APPROVAL WILL NOT AWARD POINTS."}
          </p>
          <div className="flex gap-[6px]">
            <button
              type="button"
              onClick={() => void act("approved")}
              disabled={busy}
              className="border border-[#999999] bg-[#228B22] px-[9px] py-[6px] text-[12px] font-bold text-white uppercase disabled:opacity-50"
            >
              CONFIRM
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={busy}
              className="border border-[#999999] bg-white px-[9px] py-[6px] text-[12px] font-bold text-[#001089] uppercase disabled:opacity-50"
            >
              CANCEL
            </button>
          </div>
        </div>
      ) : null}
      {result ? (
        <p className="text-[9px] font-bold tracking-[0.03em] text-[#228B22] uppercase">
          {result}
        </p>
      ) : null}
      <div className="flex gap-[6px]">
      <button
        type="button"
        onClick={requestApprove}
        disabled={busy}
        className="border border-[#999999] bg-white py-[6px] px-[12px] text-[12px] font-bold text-[#228B22] uppercase disabled:opacity-50 hover:bg-[#f8eac7] cursor-pointer"
      >
        APPROVE
      </button>
      <button
        type="button"
        onClick={() => void act("rejected")}
        disabled={busy}
        className="border border-[#999999] bg-white py-[6px] px-[12px] text-[12px] font-bold text-[#a60315] uppercase disabled:opacity-50 hover:bg-[#f8eac7] cursor-pointer"
      >
        REJECT
      </button>
      </div>
    </div>
  );
}
