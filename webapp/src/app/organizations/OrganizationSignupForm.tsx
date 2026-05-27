"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Status =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved" }
  | { kind: "error"; message: string };

const EMPTY = {
  name: "",
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  street_address: "",
  website_url: "",
  business_category: "",
  description: "",
};

export function OrganizationSignupForm() {
  const router = useRouter();
  const [values, setValues] = useState(EMPTY);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  function setField(field: keyof typeof EMPTY, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (status.kind !== "idle") setStatus({ kind: "idle" });
  }

  async function submit() {
    setStatus({ kind: "saving" });
    const response = await fetch("/api/organizations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
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
            : "ORGANIZATION CREATE FAILED",
      });
      return;
    }
    setValues(EMPTY);
    setStatus({ kind: "saved" });
    router.refresh();
  }

  return (
    <div className="border border-[#999999]">
      <div className="flex h-[27px] items-center border-b border-[#999999] bg-[#94a3d6] px-[9px]">
        <h2 className="text-[15px] font-bold tracking-[0.03em] text-white uppercase">
          BUSINESS SIGNUP
        </h2>
      </div>
      <div className="grid gap-[6px] p-[9px]">
        {(Object.keys(EMPTY) as Array<keyof typeof EMPTY>).map((field) => (
          <input
            key={field}
            value={values[field]}
            onChange={(event) => setField(field, event.target.value)}
            placeholder={field.replaceAll("_", " ").toUpperCase()}
            className="border border-[#999999] p-[6px] text-[12px] tracking-[0.03em] text-[#001089] uppercase placeholder:text-[#999999]"
          />
        ))}
        <button
          type="button"
          onClick={submit}
          disabled={status.kind === "saving"}
          className="border border-[#999999] bg-[#001089] px-[9px] py-[6px] text-[12px] font-bold tracking-[0.03em] text-white uppercase disabled:bg-white disabled:text-[#999999]"
        >
          {status.kind === "saving" ? "[SUBMITTING]" : "[SUBMIT FOR REVIEW]"}
        </button>
        {status.kind === "saved" ? (
          <p className="border border-[#228B22] p-[6px] text-[9px] font-bold tracking-[0.03em] text-[#228B22] uppercase">
            ORGANIZATION SUBMITTED FOR ADMIN REVIEW.
          </p>
        ) : null}
        {status.kind === "error" ? (
          <p className="border border-[#a60315] p-[6px] text-[9px] font-bold tracking-[0.03em] text-[#a60315] uppercase">
            {status.message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
