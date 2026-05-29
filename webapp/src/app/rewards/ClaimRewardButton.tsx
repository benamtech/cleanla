"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Status =
  | { kind: "idle" }
  | { kind: "claiming" }
  | { kind: "claimed"; claimCode: string; expiresAt: string }
  | { kind: "error"; message: string };

export function ClaimRewardButton({
  rewardId,
  canClaim,
  disabledReason,
}: {
  rewardId: string;
  canClaim: boolean;
  disabledReason: string | null;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function claim() {
    setStatus({ kind: "claiming" });
    const response = await fetch(`/api/rewards/${rewardId}/claim`, {
      method: "POST",
    });
    const payload = (await response.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;

    if (!response.ok) {
      setStatus({
        kind: "error",
        message:
          typeof payload.error === "string"
            ? payload.error.replaceAll("_", " ")
            : "CLAIM FAILED",
      });
      return;
    }

    setStatus({
      kind: "claimed",
      claimCode: String(payload.claim_code ?? ""),
      expiresAt: String(payload.expires_at ?? ""),
    });
    router.refresh();
  }

  if (status.kind === "claimed") {
    return (
      <div className="grid gap-[6px] border border-[#228B22] p-[6px] text-[#228B22]">
        <p className="text-[18px] font-bold tracking-[0.12em]">
          {status.claimCode}
        </p>
        <p className="text-[9px] font-bold tracking-[0.03em] uppercase">
          SHOW THIS CODE TO THE BUSINESS. EXPIRES{" "}
          {new Date(status.expiresAt).toISOString().slice(0, 10)}.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-[6px]">
      <button
        type="button"
        onClick={claim}
        disabled={!canClaim || status.kind === "claiming"}
        className="min-h-[45px] border border-[#999999] bg-[#228B22] px-[9px] py-[6px] text-[12px] font-bold tracking-[0.03em] text-white uppercase enabled:hover:opacity-90 disabled:bg-white disabled:text-[#999999]"
      >
        {status.kind === "claiming" ? "[CLAIMING]" : "[CLAIM REWARD]"}
      </button>
      {!canClaim && disabledReason ? (
        <p className="border border-[#999999] p-[6px] text-[9px] font-bold tracking-[0.03em] text-[#999999] uppercase">
          {disabledReason}
        </p>
      ) : null}
      {status.kind === "error" ? (
        <p className="border border-[#a60315] p-[6px] text-[9px] font-bold tracking-[0.03em] text-[#a60315] uppercase">
          {status.message}
        </p>
      ) : null}
    </div>
  );
}
