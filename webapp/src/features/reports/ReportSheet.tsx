"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  MAX_GPS_ACCURACY_M,
  REPORT_DEFAULT_CATEGORY,
  REPORT_DEFAULT_SEVERITY,
  REPORT_DESCRIPTION_MAX_LENGTH,
  REPORT_SEVERITIES,
} from "@/features/reports/constants";
import { CATEGORY_COLORS, formatCategory } from "@/features/spots/display";
import { SPOT_CATEGORIES, type SpotCategory } from "@/features/spots/types";
import { createClient as createSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * 3-tap report flow:
 *
 *   Tap 1: [REPORT] on the map opens this sheet → camera + GPS auto-start.
 *   Tap 2: [CAPTURE] takes the photo → flips to confirm view with sensible defaults.
 *   Tap 3: [SEND] submits with photo + auto-location + category (default TRASH) + severity (default 3).
 *
 * The confirm view exposes category pills + optional description for users who
 * want to refine before sending — but the defaults are good enough that
 * tapping [SEND] immediately produces a valid report.
 */

type GpsCapture = {
  lat: number;
  lng: number;
  accuracy: number;
};

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "verified"; spotId: string }
  | { kind: "unverified"; spotId: string; reason: string }
  | { kind: "location_mismatch"; spotId: string }
  | { kind: "pending"; spotId: string }
  | { kind: "failed"; message: string };

type CameraState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ready" }
  | { kind: "error"; message: string };

type GpsState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ready" }
  | { kind: "error"; message: string };

type Phase = "capture" | "confirm" | "done";

function dataUrlFromBlob(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("PHOTO_PREVIEW_FAILED"));
    reader.readAsDataURL(blob);
  });
}

function canvasToWebp(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("PHOTO_CAPTURE_FAILED"));
      },
      "image/webp",
      0.82,
    );
  });
}

export function ReportSheet({
  onClose,
  onSubmitted,
  isSignedIn = false,
}: {
  onClose: () => void;
  onSubmitted: () => void;
  /**
   * Whether the user is signed in. Drives the post-submit lazy-auth
   * prompt: anonymous submitters see a "claim your score" form on the
   * DONE screen; signed-in users see a clean confirmation.
   */
  isSignedIn?: boolean;
}) {
  // Post-submit lazy-auth state (only used in DONE phase).
  const [claimEmail, setClaimEmail] = useState("");
  const [claimNotice, setClaimNotice] = useState<
    | { kind: "idle" }
    | { kind: "sending" }
    | { kind: "sent" }
    | { kind: "error"; message: string }
  >({ kind: "idle" });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraState, setCameraState] = useState<CameraState>({ kind: "idle" });
  const [gpsState, setGpsState] = useState<GpsState>({ kind: "idle" });
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoCapturedAt, setPhotoCapturedAt] = useState<string | null>(null);
  const [gpsCapture, setGpsCapture] = useState<GpsCapture | null>(null);
  const [category, setCategory] = useState<SpotCategory>(REPORT_DEFAULT_CATEGORY);
  const [severity, setSeverity] = useState<number>(REPORT_DEFAULT_SEVERITY);
  const [description, setDescription] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({ kind: "idle" });
  const [phase, setPhase] = useState<Phase>("capture");

  const canSubmit =
    phase === "confirm" &&
    Boolean(photoBlob) &&
    Boolean(photoCapturedAt) &&
    Boolean(gpsCapture) &&
    submitState.kind === "idle" &&
    description.trim().length <= REPORT_DESCRIPTION_MAX_LENGTH;

  const gpsLabel = useMemo(() => {
    if (!gpsCapture) return "WAITING ON GPS";
    return `${gpsCapture.lat.toFixed(5)}, ${gpsCapture.lng.toFixed(5)} +/- ${Math.round(
      gpsCapture.accuracy,
    )}M`;
  }, [gpsCapture]);

  async function startCamera() {
    setCameraState({ kind: "loading" });
    try {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraState({ kind: "ready" });
    } catch {
      setCameraState({
        kind: "error",
        message: "CAMERA PERMISSION OR DEVICE FAILED",
      });
    }
  }

  function captureGps() {
    setGpsState({ kind: "loading" });
    if (!navigator.geolocation) {
      setGpsState({ kind: "error", message: "GEOLOCATION IS NOT AVAILABLE" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsCapture({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setGpsState({ kind: "ready" });
      },
      () => {
        setGpsState({ kind: "error", message: "GPS PERMISSION OR FIX FAILED" });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  }

  // AUTO-START camera + GPS on mount — this is the move that turns the
  // first tap ([REPORT] on the map) into one that has work behind it.
  // By the time the user is ready for tap 2 ([CAPTURE]), both streams
  // are already in flight. The queueMicrotask defer is required because
  // both helpers setState synchronously, which would trip the
  // react-hooks/set-state-in-effect lint rule if called inline.
  useEffect(() => {
    queueMicrotask(() => {
      void startCamera();
      captureGps();
    });
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  async function capturePhoto() {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      setCameraState({ kind: "error", message: "CAMERA IS NOT READY" });
      return;
    }
    const canvas = document.createElement("canvas");
    const maxWidth = 1280;
    const scale = Math.min(1, maxWidth / video.videoWidth);
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    const context = canvas.getContext("2d");
    if (!context) return;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const blob = await canvasToWebp(canvas);
    setPhotoBlob(blob);
    setPhotoPreview(await dataUrlFromBlob(blob));
    setPhotoCapturedAt(new Date().toISOString());
    setPhase("confirm");
    // Stop the live stream — we're past the capture stage and don't need it.
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }

  function retakePhoto() {
    setPhotoBlob(null);
    setPhotoPreview(null);
    setPhotoCapturedAt(null);
    setPhase("capture");
    void startCamera();
  }

  async function submitReport() {
    if (!photoBlob || !gpsCapture || !photoCapturedAt) return;

    setSubmitState({ kind: "submitting" });
    const formData = new FormData();
    formData.set(
      "photo",
      new File([photoBlob], "report.webp", { type: "image/webp" }),
    );
    formData.set("category", category);
    formData.set("severity", String(severity));
    formData.set("description", description.trim());
    formData.set("lat", String(gpsCapture.lat));
    formData.set("lng", String(gpsCapture.lng));
    formData.set("gps_accuracy_m", String(gpsCapture.accuracy));
    formData.set("client_captured_at", photoCapturedAt);
    formData.set(
      "device_context",
      JSON.stringify({
        userAgent: navigator.userAgent,
        viewport: { width: window.innerWidth, height: window.innerHeight },
      }),
    );

    const response = await fetch("/api/reports", {
      method: "POST",
      body: formData,
    });
    const payload: unknown = await response.json();

    if (!response.ok) {
      const message =
        typeof payload === "object" && payload !== null && "error" in payload
          ? String((payload as { error: unknown }).error)
          : "REPORT_FAILED";
      setSubmitState({ kind: "failed", message });
      return;
    }

    const body =
      typeof payload === "object" && payload !== null
        ? (payload as Record<string, unknown>)
        : {};
    const spotId = typeof body.spot_id === "string" ? body.spot_id : "";
    const vs =
      typeof body.verification_status === "string"
        ? body.verification_status
        : "pending";
    const vr =
      typeof body.verification_reason === "string"
        ? body.verification_reason
        : "";

    if (vs === "verified") setSubmitState({ kind: "verified", spotId });
    else if (vs === "unverified")
      setSubmitState({ kind: "unverified", spotId, reason: vr });
    else if (vs === "location_mismatch")
      setSubmitState({ kind: "location_mismatch", spotId });
    else setSubmitState({ kind: "pending", spotId });

    setPhase("done");
    onSubmitted();
  }

  async function sendClaimLink() {
    const trimmed = claimEmail.trim();
    if (!trimmed) return;
    setClaimNotice({ kind: "sending" });
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setClaimNotice({
          kind: "error",
          message: error.message.toUpperCase(),
        });
        return;
      }
      setClaimNotice({ kind: "sent" });
    } catch (err) {
      setClaimNotice({
        kind: "error",
        message: err instanceof Error ? err.message.toUpperCase() : "FAILED",
      });
    }
  }

  const containerCls =
    "absolute inset-[9px] z-20 flex flex-col overflow-hidden border border-[#999999] bg-white md:left-auto md:top-[9px] md:right-[9px] md:bottom-[9px] md:w-[420px]";

  // ─── HEADER (same across all phases) ──────────────────────────────────
  const header = (
    <div className="flex h-[27px] flex-none items-center justify-between border-b border-[#999999] bg-[#001089] px-[9px]">
      <h2 className="text-[15px] font-bold tracking-[0.03em] text-white uppercase">
        {phase === "capture"
          ? "REPORT SPOT · 1 OF 2"
          : phase === "confirm"
            ? "REPORT SPOT · 2 OF 2"
            : "REPORT SPOT · SENT"}
      </h2>
      <button
        type="button"
        onClick={onClose}
        className="border border-white bg-white px-[6px] py-[3px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase hover:bg-[#f8eac7]"
        aria-label="Close report"
      >
        [x]
      </button>
    </div>
  );

  // ─── PHASE: CAPTURE ───────────────────────────────────────────────────
  if (phase === "capture") {
    return (
      <aside className={containerCls}>
        {header}
        <div className="flex flex-1 flex-col">
          <div className="relative flex-1 bg-[#001089]">
            <video
              ref={videoRef}
              playsInline
              muted
              className="absolute inset-0 h-full w-full object-cover"
            />
            {cameraState.kind !== "ready" ? (
              <div className="absolute inset-0 grid place-items-center bg-[#001089]">
                <p className="px-[18px] text-center text-[12px] font-bold tracking-[0.03em] text-white uppercase">
                  {cameraState.kind === "loading"
                    ? "STARTING CAMERA…"
                    : cameraState.kind === "error"
                      ? cameraState.message
                      : "CAMERA"}
                </p>
              </div>
            ) : null}
          </div>
          <div className="grid flex-none gap-[6px] border-t border-[#999999] bg-white p-[9px]">
            <div className="flex flex-wrap items-center justify-between gap-[6px] text-[9px] font-bold tracking-[0.03em] uppercase">
              <span className="text-[#001089]">
                {gpsState.kind === "ready"
                  ? `GPS · ${gpsLabel}`
                  : gpsState.kind === "loading"
                    ? "GPS · ACQUIRING…"
                    : gpsState.kind === "error"
                      ? `GPS · ${gpsState.message}`
                      : "GPS · IDLE"}
              </span>
              {gpsState.kind === "error" ? (
                <button
                  type="button"
                  onClick={captureGps}
                  className="border border-[#999999] bg-white px-[6px] py-[3px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase hover:bg-[#f8eac7]"
                >
                  [RETRY GPS]
                </button>
              ) : null}
            </div>
            <button
              type="button"
              onClick={capturePhoto}
              disabled={cameraState.kind !== "ready"}
              className="border border-[#999999] bg-[#001089] px-[9px] py-[18px] text-[15px] font-bold tracking-[0.03em] text-white uppercase enabled:hover:bg-[#94a3d6] disabled:bg-white disabled:text-[#999999]"
            >
              [CAPTURE]
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // ─── PHASE: CONFIRM ───────────────────────────────────────────────────
  if (phase === "confirm") {
    const gpsPoor = gpsCapture && gpsCapture.accuracy > MAX_GPS_ACCURACY_M;

    return (
      <aside className={containerCls}>
        {header}
        <div className="flex-1 overflow-auto">
          {/* Photo preview */}
          <div className="border-b border-[#999999] bg-[#f8eac7]">
            {photoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoPreview}
                alt="Captured report"
                className="block max-h-[300px] w-full object-cover"
              />
            ) : null}
          </div>

          {/* Auto-location chip */}
          <div className="flex flex-wrap items-center justify-between gap-[6px] border-b border-[#999999] bg-white px-[9px] py-[6px]">
            <span className="text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase">
              LOCATION · {gpsLabel}
            </span>
            <button
              type="button"
              onClick={retakePhoto}
              className="border border-[#999999] bg-white px-[6px] py-[3px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase hover:bg-[#f8eac7]"
            >
              [RETAKE]
            </button>
          </div>

          {gpsPoor ? (
            <div className="border-b border-[#999999] bg-white px-[9px] py-[6px] text-[9px] font-bold tracking-[0.03em] text-[#a60315] uppercase">
              POOR GPS ACCURACY · VERIFICATION MAY FAIL
            </div>
          ) : null}

          {/* Category pill bar — defaults to TRASH, tap to change */}
          <div className="grid gap-[6px] border-b border-[#999999] bg-white p-[9px]">
            <span className="text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase">
              CATEGORY
            </span>
            <div className="grid grid-cols-2 gap-[6px] sm:grid-cols-3">
              {SPOT_CATEGORIES.map((item) => {
                const selected = category === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={
                      selected
                        ? "border-l-[6px] border-y border-r border-[#999999] bg-white px-[6px] py-[6px] text-left text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase"
                        : "border border-[#999999] bg-white px-[6px] py-[6px] text-left text-[9px] font-bold tracking-[0.03em] text-[#999999] uppercase hover:bg-[#f8eac7]"
                    }
                    style={
                      selected
                        ? { borderLeftColor: CATEGORY_COLORS[item] }
                        : undefined
                    }
                  >
                    {formatCategory(item)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional advanced fields — hidden behind a toggle to keep 3-tap clean */}
          <div className="border-b border-[#999999] bg-white p-[9px]">
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase hover:bg-[#f8eac7]"
            >
              {showAdvanced ? "[−] HIDE OPTIONAL" : "[+] OPTIONAL: SEVERITY + NOTE"}
            </button>
            {showAdvanced ? (
              <div className="mt-[9px] grid gap-[9px]">
                <div className="grid gap-[6px]">
                  <span className="text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase">
                    SEVERITY · DEFAULT 3
                  </span>
                  <div className="grid grid-cols-5 gap-[6px]">
                    {REPORT_SEVERITIES.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setSeverity(item)}
                        className={
                          severity === item
                            ? "border border-[#999999] bg-[#001089] px-[6px] py-[6px] text-[12px] font-bold text-white"
                            : "border border-[#999999] bg-white px-[6px] py-[6px] text-[12px] font-bold text-[#001089] hover:bg-[#f8eac7]"
                        }
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-[6px]">
                  <span className="text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase">
                    NOTE · OPTIONAL
                  </span>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={REPORT_DESCRIPTION_MAX_LENGTH}
                    placeholder="OPTIONAL CONTEXT"
                    className="min-h-[54px] border border-[#999999] bg-white p-[6px] text-[12px] leading-[18px] text-[#001089] placeholder:text-[#999999]"
                  />
                  <span className="text-[9px] tracking-[0.03em] text-[#999999] uppercase">
                    {description.trim().length}/{REPORT_DESCRIPTION_MAX_LENGTH}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* SEND button — pinned to bottom */}
        <div className="flex-none border-t border-[#999999] bg-white p-[9px]">
          <button
            type="button"
            onClick={submitReport}
            disabled={!canSubmit}
            className="block w-full border border-[#999999] bg-[#001089] px-[9px] py-[18px] text-[15px] font-bold tracking-[0.03em] text-white uppercase enabled:hover:bg-[#94a3d6] disabled:bg-white disabled:text-[#999999]"
          >
            {submitState.kind === "submitting" ? "[SENDING…]" : "[SEND]"}
          </button>
          {!gpsCapture ? (
            <p className="mt-[6px] text-center text-[9px] font-bold tracking-[0.03em] text-[#999999] uppercase">
              WAITING ON GPS BEFORE SEND
            </p>
          ) : null}
        </div>
      </aside>
    );
  }

  // ─── PHASE: DONE ──────────────────────────────────────────────────────
  return (
    <aside className={containerCls}>
      {header}
      <div className="flex flex-1 flex-col gap-[9px] overflow-auto p-[9px]">
        {submitState.kind === "verified" ? (
          <div className="border border-[#228B22] bg-white p-[9px] text-[12px] font-bold tracking-[0.03em] text-[#228B22] uppercase">
            ✓︎ LOCATION VERIFIED. SPOT {submitState.spotId} IS LIVE.
          </div>
        ) : null}
        {submitState.kind === "pending" ? (
          <div className="border border-[#999999] bg-white p-[9px] text-[12px] font-bold tracking-[0.03em] text-[#001089] uppercase">
            SPOT {submitState.spotId} SUBMITTED · PENDING REVIEW.
          </div>
        ) : null}
        {submitState.kind === "unverified" ? (
          <div className="border border-[#999999] bg-white p-[9px] text-[12px] font-bold tracking-[0.03em] text-[#c7a87d] uppercase">
            SUBMITTED · UNVERIFIED. SPOT {submitState.spotId} IS LIVE WITH A
            FLAG.
          </div>
        ) : null}
        {submitState.kind === "location_mismatch" ? (
          <div className="border border-[#999999] bg-white p-[9px] text-[12px] font-bold tracking-[0.03em] text-[#c7a87d] uppercase">
            SUBMITTED · GPS DID NOT MATCH. SPOT {submitState.spotId} FLAGGED.
          </div>
        ) : null}
        {submitState.kind === "failed" ? (
          <div className="border border-[#a60315] bg-white p-[9px] text-[12px] font-bold tracking-[0.03em] text-[#a60315] uppercase">
            {submitState.message}
          </div>
        ) : null}
        {!isSignedIn ? (
          <div className="border border-[#999999] bg-[#f8eac7] p-[9px]">
            <p className="text-[12px] font-bold tracking-[0.03em] text-[#001089] uppercase">
              YOUR REPORT IS LIVE.
            </p>
            <p className="mt-[6px] text-[9px] tracking-[0.03em] text-[#001089] uppercase">
              WANT CREDIT FOR IT? GET A LOGIN LINK BY EMAIL. NO PASSWORD.
              FUTURE REPORTS WILL BE ATTRIBUTED TO YOUR ACCOUNT.
            </p>
            <div className="mt-[9px] flex flex-wrap gap-[6px]">
              <input
                value={claimEmail}
                onChange={(e) => setClaimEmail(e.target.value)}
                type="email"
                placeholder="EMAIL"
                disabled={claimNotice.kind === "sending" || claimNotice.kind === "sent"}
                className="flex-1 border border-[#999999] bg-white p-[6px] text-[12px] tracking-[0.03em] uppercase placeholder:text-[#999999] disabled:bg-[#f8eac7]"
              />
              <button
                type="button"
                onClick={sendClaimLink}
                disabled={
                  !claimEmail.trim() ||
                  claimNotice.kind === "sending" ||
                  claimNotice.kind === "sent"
                }
                className="border border-[#999999] bg-[#001089] px-[9px] py-[6px] text-[9px] font-bold tracking-[0.03em] text-white uppercase enabled:hover:bg-[#94a3d6] disabled:bg-white disabled:text-[#999999]"
              >
                {claimNotice.kind === "sending"
                  ? "[SENDING]"
                  : claimNotice.kind === "sent"
                    ? "[LINK SENT]"
                    : "[EMAIL ME]"}
              </button>
            </div>
            {claimNotice.kind === "sent" ? (
              <p className="mt-[6px] text-[9px] font-bold tracking-[0.03em] text-[#228B22] uppercase">
                ✓︎ LOGIN LINK SENT. CHECK YOUR EMAIL.
              </p>
            ) : null}
            {claimNotice.kind === "error" ? (
              <p className="mt-[6px] text-[9px] font-bold tracking-[0.03em] text-[#a60315] uppercase">
                × {claimNotice.message}
              </p>
            ) : null}
          </div>
        ) : (
          <div className="border border-[#228B22] bg-white p-[9px] text-[9px] font-bold tracking-[0.03em] text-[#228B22] uppercase">
            ✓︎ ATTRIBUTED TO YOUR ACCOUNT.
          </div>
        )}
      </div>
      <div className="flex-none border-t border-[#999999] bg-white p-[9px]">
        <button
          type="button"
          onClick={onClose}
          className="block w-full border border-[#999999] bg-[#001089] px-[9px] py-[12px] text-[12px] font-bold tracking-[0.03em] text-white uppercase hover:bg-[#94a3d6]"
        >
          [DONE]
        </button>
      </div>
    </aside>
  );
}
