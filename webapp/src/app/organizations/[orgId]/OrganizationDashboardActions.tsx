"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type RewardForm = {
  title: string;
  description: string;
  points_required: string;
  redemption_instructions: string;
  is_active: boolean;
};

const EMPTY_REWARD: RewardForm = {
  title: "",
  description: "",
  points_required: "200",
  redemption_instructions: "",
  is_active: true,
};

export function RewardCreateForm({ orgId }: { orgId: string }) {
  const router = useRouter();
  const [values, setValues] = useState<RewardForm>(EMPTY_REWARD);
  const [message, setMessage] = useState<string | null>(null);

  async function submit() {
    const response = await fetch(`/api/organizations/${orgId}/rewards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        points_required: Number(values.points_required),
      }),
    });
    const payload = (await response.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    if (!response.ok) {
      setMessage(
        typeof payload.error === "string"
          ? payload.error.replaceAll("_", " ")
          : "REWARD CREATE FAILED",
      );
      return;
    }
    setValues(EMPTY_REWARD);
    setMessage("REWARD CREATED");
    router.refresh();
  }

  return (
    <div className="grid gap-[6px] border border-[#999999] p-[9px]">
      <h2 className="text-[15px] font-bold tracking-[0.03em] text-[#001089] uppercase">
        CREATE REWARD
      </h2>
      <input
        value={values.title}
        onChange={(event) => setValues({ ...values, title: event.target.value })}
        placeholder="TITLE"
        className="min-h-[45px] border border-[#999999] p-[6px] text-[12px] uppercase"
      />
      <input
        value={values.description}
        onChange={(event) =>
          setValues({ ...values, description: event.target.value })
        }
        placeholder="DESCRIPTION"
        className="min-h-[45px] border border-[#999999] p-[6px] text-[12px] uppercase"
      />
      <input
        value={values.points_required}
        onChange={(event) =>
          setValues({ ...values, points_required: event.target.value })
        }
        placeholder="POINTS"
        type="number"
        min={200}
        className="min-h-[45px] border border-[#999999] p-[6px] text-[12px] uppercase"
      />
      <input
        value={values.redemption_instructions}
        onChange={(event) =>
          setValues({ ...values, redemption_instructions: event.target.value })
        }
        placeholder="REDEMPTION INSTRUCTIONS"
        className="min-h-[45px] border border-[#999999] p-[6px] text-[12px] uppercase"
      />
      <label className="flex items-center gap-[6px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase">
        <input
          type="checkbox"
          checked={values.is_active}
          onChange={(event) =>
            setValues({ ...values, is_active: event.target.checked })
          }
        />
        ACTIVE
      </label>
      <button
        type="button"
        onClick={submit}
        className="border border-[#999999] bg-[#001089] min-h-[45px] px-[9px] py-[6px] text-[12px] font-bold text-white uppercase"
      >
        [CREATE]
      </button>
      {message ? (
        <p className="text-[9px] font-bold tracking-[0.03em] text-[#228B22] uppercase">
          {message}
        </p>
      ) : null}
    </div>
  );
}

export function ConfirmRedemptionForm({ orgId }: { orgId: string }) {
  const router = useRouter();
  const [claimCode, setClaimCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function confirm() {
    const response = await fetch(
      `/api/organizations/${orgId}/redemptions/confirm`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim_code: claimCode }),
      },
    );
    const payload = (await response.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    if (!response.ok) {
      setMessage(
        typeof payload.error === "string"
          ? payload.error.replaceAll("_", " ")
          : "CONFIRM FAILED",
      );
      return;
    }
    setClaimCode("");
    setMessage("REDEMPTION CONFIRMED");
    router.refresh();
  }

  return (
    <div className="grid gap-[6px] border border-[#999999] p-[9px]">
      <h2 className="text-[15px] font-bold tracking-[0.03em] text-[#001089] uppercase">
        CONFIRM CLAIM CODE
      </h2>
      <input
        value={claimCode}
        onChange={(event) => setClaimCode(event.target.value.toUpperCase())}
        placeholder="CLAIM CODE"
        className="min-h-[45px] border border-[#999999] p-[6px] text-[18px] font-bold tracking-[0.12em] uppercase"
      />
      <button
        type="button"
        onClick={confirm}
        className="border border-[#999999] bg-[#228B22] min-h-[45px] px-[9px] py-[6px] text-[12px] font-bold text-white uppercase"
      >
        [CONFIRM]
      </button>
      {message ? (
        <p className="text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase">
          {message}
        </p>
      ) : null}
    </div>
  );
}

export function RewardStatusButton({
  orgId,
  reward,
}: {
  orgId: string;
  reward: {
    id: string;
    title: string;
    description: string;
    points_required: number;
    redemption_instructions: string | null;
    is_active: boolean;
  };
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    await fetch(`/api/organizations/${orgId}/rewards/${reward.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: reward.title,
        description: reward.description,
        points_required: reward.points_required,
        redemption_instructions: reward.redemption_instructions,
        is_active: !reward.is_active,
      }),
    });
    router.refresh();
    setBusy(false);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      className="border border-[#999999] bg-white min-h-[45px] px-[9px] py-[6px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase hover:bg-[#f8eac7] disabled:opacity-50"
    >
      {reward.is_active ? "[DEACTIVATE]" : "[ACTIVATE]"}
    </button>
  );
}

export function CancelRedemptionButton({
  redemptionId,
}: {
  redemptionId: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function cancel() {
    setBusy(true);
    await fetch(`/api/rewards/redemptions/${redemptionId}/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: "organization canceled pending code" }),
    });
    router.refresh();
    setBusy(false);
  }

  return (
    <button
      type="button"
      onClick={cancel}
      disabled={busy}
      className="border border-[#999999] bg-white min-h-[45px] px-[9px] py-[6px] text-[9px] font-bold tracking-[0.03em] text-[#a60315] uppercase hover:bg-[#f8eac7] disabled:opacity-50"
    >
      [CANCEL / REFUND]
    </button>
  );
}
