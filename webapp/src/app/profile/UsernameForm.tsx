"use client";

import { useState } from "react";

type Status =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved"; username: string }
  | { kind: "error"; message: string };

const USERNAME_HINT = "3-24 CHARS · LETTERS NUMBERS _ -";

export function UsernameForm({ initial }: { initial: string | null }) {
  const [value, setValue] = useState(initial ?? "");
  const [status, setStatus] = useState<Status>(
    initial ? { kind: "saved", username: initial } : { kind: "idle" },
  );

  async function save() {
    setStatus({ kind: "saving" });
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: value.trim() }),
    });
    const payload = (await response.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    if (!response.ok) {
      const message =
        typeof payload.message === "string"
          ? payload.message.toUpperCase()
          : typeof payload.error === "string"
            ? String(payload.error).toUpperCase()
            : "USERNAME UPDATE FAILED";
      setStatus({ kind: "error", message });
      return;
    }
    const saved =
      typeof payload.username === "string" ? payload.username : value.trim();
    setStatus({ kind: "saved", username: saved });
  }

  const canSave =
    value.trim().length >= 3 &&
    value.trim().length <= 24 &&
    /^[A-Za-z0-9_-]+$/.test(value.trim()) &&
    status.kind !== "saving" &&
    (status.kind !== "saved" || status.username !== value.trim());

  return (
    <div className="border border-[#999999]">
      <div className="flex h-[27px] items-center justify-between border-b border-[#999999] bg-[#94a3d6] px-[9px]">
        <h2 className="text-[15px] font-bold tracking-[0.03em] text-white uppercase">
          PUBLIC USERNAME
        </h2>
        <span className="text-[9px] font-bold tracking-[0.03em] text-white uppercase">
          USED FOR ATTRIBUTION
        </span>
      </div>
      <div className="grid gap-[9px] p-[9px]">
        <p className="text-[9px] tracking-[0.03em] text-[#001089] uppercase">
          THIS IS WHAT APPEARS WHEN YOU REPORT OR CLEAN A SPOT.
          {initial ? null : " UNTIL SET, YOUR CONTRIBUTIONS SHOW AS ANONYMOUS."}
        </p>
        <div className="flex flex-wrap items-center gap-[6px]">
          <span className="text-[12px] font-bold text-[#001089]">@</span>
          <input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (status.kind === "saved" || status.kind === "error") {
                setStatus({ kind: "idle" });
              }
            }}
            maxLength={24}
            placeholder="YOURNAME"
            className="flex-1 border border-[#999999] bg-white p-[6px] text-[12px] tracking-[0.03em] text-[#001089] uppercase placeholder:text-[#999999]"
            aria-label="Username"
          />
          <button
            type="button"
            onClick={save}
            disabled={!canSave}
            className="border border-[#999999] bg-[#001089] px-[12px] py-[6px] text-[12px] font-bold tracking-[0.03em] text-white uppercase enabled:hover:bg-[#94a3d6] disabled:bg-white disabled:text-[#999999]"
          >
            {status.kind === "saving" ? "[SAVING]" : "[SAVE]"}
          </button>
        </div>
        <p className="text-[9px] tracking-[0.03em] text-[#999999] uppercase">
          {USERNAME_HINT}
        </p>
        {status.kind === "saved" ? (
          <div className="border border-[#228B22] bg-white p-[6px] text-[9px] font-bold tracking-[0.03em] text-[#228B22] uppercase">
            ✓︎ USERNAME @{status.username} SAVED
          </div>
        ) : null}
        {status.kind === "error" ? (
          <div className="border border-[#a60315] bg-white p-[6px] text-[9px] font-bold tracking-[0.03em] text-[#a60315] uppercase">
            × {status.message}
          </div>
        ) : null}
      </div>
    </div>
  );
}
