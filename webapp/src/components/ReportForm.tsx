"use client";

import { useState, useTransition } from "react";
import { submitReport } from "@/lib/reports/actions";

type LocationState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ok"; lat: number; lng: number }
  | { kind: "error"; message: string };

type FormState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export function ReportForm() {
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationState>({ kind: "idle" });
  const [description, setDescription] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<FormState>({ kind: "idle" });
  const [isPending, startTransition] = useTransition();

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setPhotoName(null);
      setPhotoPreviewUrl(null);
      return;
    }
    setPhotoName(file.name);
    if (photoPreviewUrl) {
      URL.revokeObjectURL(photoPreviewUrl);
    }
    setPhotoPreviewUrl(URL.createObjectURL(file));
  }

  function captureLocation() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocation({
        kind: "error",
        message: "GEOLOCATION NOT AVAILABLE in this browser.",
      });
      return;
    }

    setLocation({ kind: "loading" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          kind: "ok",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        const msg =
          err.code === err.PERMISSION_DENIED
            ? "PERMISSION DENIED — allow location access to file a report."
            : err.code === err.POSITION_UNAVAILABLE
              ? "LOCATION UNAVAILABLE — try moving to a window."
              : err.code === err.TIMEOUT
                ? "LOCATION TIMED OUT — try again."
                : "COULD NOT GET LOCATION — try again.";
        setLocation({ kind: "error", message: msg });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 },
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (location.kind !== "ok") {
      setFormState({
        kind: "error",
        message: "LOCATION REQUIRED — tap GET MY LOCATION first.",
      });
      return;
    }

    const formData = new FormData(event.currentTarget);
    formData.set("lat", String(location.lat));
    formData.set("lng", String(location.lng));

    setFormState({ kind: "submitting" });
    startTransition(async () => {
      const result = await submitReport(formData);
      if (result.ok) {
        setFormState({ kind: "success" });
        setPhotoName(null);
        if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
        setPhotoPreviewUrl(null);
        setLocation({ kind: "idle" });
        setDescription("");
        setNeighborhood("");
        setEmail("");
        event.currentTarget?.reset();
      } else {
        setFormState({ kind: "error", message: result.error });
      }
    });
  }

  const submitting = isPending || formState.kind === "submitting";

  return (
    <form onSubmit={handleSubmit} className="border border-[#999999] bg-white p-[18px]">
      <div className="mb-[18px] flex items-center justify-between border-b border-[#999999] pb-[9px]">
        <h2 className="text-[15px] font-bold uppercase tracking-[0.03em] text-[#001089]">
          File a report
        </h2>
        <span className="text-[9px] uppercase tracking-[0.03em] text-[#999999]">
          public · no account · 3 fields
        </span>
      </div>

      {/* Photo */}
      <div className="mb-[15px]">
        <label
          htmlFor="photo"
          className="mb-[6px] block text-[12px] font-bold uppercase tracking-[0.03em] text-[#001089]"
        >
          [1] photo of the issue
        </label>
        <div className="flex items-center gap-[9px]">
          <label className="cursor-pointer border border-[#999999] bg-white px-[12px] py-[6px] text-[12px] font-bold uppercase tracking-[0.03em] text-[#001089] hover:bg-[#f8eac7]">
            <input
              id="photo"
              name="photo"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoChange}
              className="sr-only"
              required
            />
            {photoName ? "[CHANGE]" : "[CHOOSE PHOTO]"}
          </label>
          <span className="truncate text-[12px] text-[#001089]">
            {photoName ?? "no file chosen"}
          </span>
        </div>
        {photoPreviewUrl ? (
          <div className="mt-[9px] border border-[#999999] bg-[#f8eac7] p-[6px]">
            {/* Browser-rendered preview — not the uploaded URL. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoPreviewUrl}
              alt="preview"
              className="block max-h-[240px] w-full object-contain"
            />
          </div>
        ) : null}
      </div>

      {/* Location */}
      <div className="mb-[15px]">
        <label
          htmlFor="get-location"
          className="mb-[6px] block text-[12px] font-bold uppercase tracking-[0.03em] text-[#001089]"
        >
          [2] location
        </label>
        <div className="flex items-center gap-[9px]">
          <button
            id="get-location"
            type="button"
            onClick={captureLocation}
            className="border border-[#999999] bg-white px-[12px] py-[6px] text-[12px] font-bold uppercase tracking-[0.03em] text-[#001089] hover:bg-[#f8eac7] disabled:opacity-50"
            disabled={location.kind === "loading"}
          >
            {location.kind === "loading" ? "[FINDING…]" : "[GET MY LOCATION]"}
          </button>
          <span className="text-[12px] text-[#001089]">
            {location.kind === "ok"
              ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`
              : location.kind === "error"
                ? location.message
                : "browser permission required"}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="mb-[15px]">
        <label
          htmlFor="description"
          className="mb-[6px] block text-[12px] font-bold uppercase tracking-[0.03em] text-[#001089]"
        >
          [3] what is it
        </label>
        <input
          id="description"
          name="description"
          type="text"
          placeholder="e.g. illegal dumping at curb, graffiti on wall"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={240}
          required
          className="w-full border border-[#999999] bg-white px-[6px] py-[6px] text-[12px] text-[#001089] placeholder-[#999999] focus:border-[#001089] focus:bg-[#f8eac7] focus:outline-none"
        />
        <div className="mt-[3px] text-right text-[9px] uppercase tracking-[0.03em] text-[#999999]">
          {description.length} / 240
        </div>
      </div>

      {/* Optional: neighborhood + email */}
      <details className="mb-[18px] border border-[#999999] bg-white">
        <summary className="cursor-pointer border-b border-[#999999] bg-[#94a3d6] px-[9px] py-[6px] text-[12px] font-bold uppercase tracking-[0.03em] text-white">
          [+] optional details
        </summary>
        <div className="grid gap-[12px] p-[9px]">
          <div>
            <label
              htmlFor="neighborhood"
              className="mb-[6px] block text-[12px] font-bold uppercase tracking-[0.03em] text-[#001089]"
            >
              neighborhood
            </label>
            <input
              id="neighborhood"
              name="neighborhood"
              type="text"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              maxLength={80}
              placeholder="e.g. boyle heights"
              className="w-full border border-[#999999] bg-white px-[6px] py-[6px] text-[12px] text-[#001089] placeholder-[#999999] focus:border-[#001089] focus:bg-[#f8eac7] focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-[6px] block text-[12px] font-bold uppercase tracking-[0.03em] text-[#001089]"
            >
              your email
            </label>
            <input
              id="email"
              name="email_optional"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="optional, only if you want a status update"
              className="w-full border border-[#999999] bg-white px-[6px] py-[6px] text-[12px] text-[#001089] placeholder-[#999999] focus:border-[#001089] focus:bg-[#f8eac7] focus:outline-none"
            />
          </div>
        </div>
      </details>

      {/* Submit */}
      <div className="flex items-center justify-between gap-[12px]">
        <button
          type="submit"
          disabled={submitting || location.kind !== "ok" || !photoName || description.length < 3}
          className="border border-[#999999] bg-[#001089] px-[18px] py-[9px] text-[12px] font-bold uppercase tracking-[0.03em] text-white hover:bg-[#001089] hover:opacity-90 disabled:opacity-40"
        >
          {submitting ? "[SUBMITTING…]" : "[SUBMIT REPORT]"}
        </button>
        <span className="text-[9px] uppercase tracking-[0.03em] text-[#999999]">
          public · no auth · published immediately
        </span>
      </div>

      {/* Status */}
      {formState.kind === "success" ? (
        <div className="mt-[12px] border border-[#228B22] bg-white px-[9px] py-[6px] text-[12px] font-bold uppercase tracking-[0.03em] text-[#228B22]">
          ✓ report submitted — refresh to see it in the feed
        </div>
      ) : null}
      {formState.kind === "error" ? (
        <div className="mt-[12px] border border-[#a60315] bg-white px-[9px] py-[6px] text-[12px] font-bold uppercase tracking-[0.03em] text-[#a60315]">
          × {formState.message}
        </div>
      ) : null}
    </form>
  );
}
