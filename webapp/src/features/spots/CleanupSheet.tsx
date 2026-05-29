"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { MAX_GPS_ACCURACY_M } from "@/features/reports/constants";

type GpsCapture = {
  lat: number;
  lng: number;
  accuracy: number;
};

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "verified"; spotId: string; pointsAwarded: number }
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

export function CleanupSheet({
  spotId,
  spotDescription,
  onClose,
  onSubmitted,
}: {
  spotId: string;
  spotDescription: string;
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraState, setCameraState] = useState<CameraState>({ kind: "idle" });
  const [gpsState, setGpsState] = useState<GpsState>({ kind: "idle" });
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoCapturedAt, setPhotoCapturedAt] = useState<string | null>(null);
  const [gpsCapture, setGpsCapture] = useState<GpsCapture | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>({ kind: "idle" });

  // Swipe-down-to-dismiss (HIG sheet gesture) on the title bar.
  const dragStartYRef = useRef<number | null>(null);
  const [dragY, setDragY] = useState(0);
  const dragStyle: CSSProperties = dragY
    ? { transform: `translateY(${dragY}px)`, transition: "none" }
    : { transition: "transform 120ms" };

  function onGrabPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    dragStartYRef.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function onGrabPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragStartYRef.current === null) return;
    const dy = event.clientY - dragStartYRef.current;
    setDragY(dy > 0 ? dy : 0);
  }
  function onGrabPointerEnd() {
    if (dragStartYRef.current === null) return;
    const shouldClose = dragY > 90;
    dragStartYRef.current = null;
    setDragY(0);
    if (shouldClose) onClose();
  }

  const gpsLabel = gpsCapture
    ? `${gpsCapture.lat.toFixed(5)}, ${gpsCapture.lng.toFixed(5)} +/- ${Math.round(gpsCapture.accuracy)}M`
    : "NO GPS";

  const canSubmit =
    Boolean(photoBlob) &&
    Boolean(photoCapturedAt) &&
    Boolean(gpsCapture) &&
    submitState.kind !== "submitting" &&
    submitState.kind !== "verified" &&
    submitState.kind !== "unverified" &&
    submitState.kind !== "location_mismatch" &&
    submitState.kind !== "pending";

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

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
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  }

  async function submitCleanup() {
    if (!canSubmit || !photoBlob || !gpsCapture || !photoCapturedAt) return;

    setSubmitState({ kind: "submitting" });
    const formData = new FormData();
    formData.set("spot_id", spotId);
    formData.set(
      "photo",
      new File([photoBlob], "cleanup.webp", { type: "image/webp" }),
    );
    formData.set("lat", String(gpsCapture.lat));
    formData.set("lng", String(gpsCapture.lng));
    formData.set("gps_accuracy_m", String(gpsCapture.accuracy));
    formData.set("client_captured_at", photoCapturedAt);

    const response = await fetch("/api/cleanup", {
      method: "POST",
      body: formData,
    });
    const payload: unknown = await response.json();

    if (!response.ok) {
      const message =
        typeof payload === "object" && payload !== null && "error" in payload
          ? String((payload as { error: unknown }).error)
          : "CLEANUP_FAILED";
      setSubmitState({ kind: "failed", message });
      return;
    }

    const body =
      typeof payload === "object" && payload !== null
        ? (payload as Record<string, unknown>)
        : {};
    const returnedSpotId =
      typeof body.spot_id === "string" ? body.spot_id : spotId;
    const vs =
      typeof body.verification_status === "string"
        ? body.verification_status
        : "pending";
    const vr =
      typeof body.verification_reason === "string"
        ? body.verification_reason
        : "";
    const pointsAwarded =
      typeof body.points_awarded === "number" ? body.points_awarded : 0;
    const cleanupStatus =
      typeof body.cleanup_status === "string" ? body.cleanup_status : "";
    const moderationStatus =
      typeof body.moderation_status === "string"
        ? body.moderation_status
        : "pending";

    if (cleanupStatus === "pending_admin_review" || moderationStatus === "pending") {
      setSubmitState({ kind: "pending", spotId: returnedSpotId });
    } else if (vs === "verified") {
      setSubmitState({ kind: "verified", spotId: returnedSpotId, pointsAwarded });
    } else if (vs === "unverified") {
      setSubmitState({ kind: "unverified", spotId: returnedSpotId, reason: vr });
    } else if (vs === "location_mismatch") {
      setSubmitState({ kind: "location_mismatch", spotId: returnedSpotId });
    } else {
      setSubmitState({ kind: "pending", spotId: returnedSpotId });
    }
    onSubmitted();
  }

  return (
    <div className="fixed inset-0 z-20" onClick={onClose}>
    <aside
      className="absolute right-[calc(9px_+_env(safe-area-inset-right))] bottom-[calc(9px_+_env(safe-area-inset-bottom))] left-[calc(9px_+_env(safe-area-inset-left))] max-h-[calc(100dvh_-_108px_-_env(safe-area-inset-top)_-_env(safe-area-inset-bottom))] overflow-auto border border-[#999999] bg-white md:left-auto md:w-[420px]"
      style={dragStyle}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="relative flex h-[27px] items-center justify-between border-b border-[#999999] bg-[#228B22] px-[9px]">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-[3px] left-1/2 h-[3px] w-[36px] -translate-x-1/2 bg-white/40"
        />
        <div
          className="flex flex-1 cursor-grab touch-none items-center select-none"
          onPointerDown={onGrabPointerDown}
          onPointerMove={onGrabPointerMove}
          onPointerUp={onGrabPointerEnd}
          onPointerCancel={onGrabPointerEnd}
        >
          <h2 className="text-[15px] font-bold tracking-[0.03em] text-white uppercase">
            MARK CLEANED
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="tap-44 flex h-[27px] min-w-[44px] items-center justify-center border border-white bg-white px-[9px] text-[9px] font-bold tracking-[0.03em] text-[#228B22] uppercase hover:bg-[#f8eac7]"
          aria-label="Close cleanup"
        >
          [x]
        </button>
      </div>

      <div className="grid gap-[9px] p-[9px]">
        <div className="border border-[#999999] p-[9px]">
          <p className="text-[9px] tracking-[0.03em] text-[#001089] uppercase leading-[18px]">
            {spotDescription}
          </p>
        </div>

        <section className="grid gap-[6px] border border-[#999999] p-[9px]">
          <div className="flex items-center justify-between gap-[9px]">
            <span className="text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase">
              AFTER PHOTO
            </span>
            <button
              type="button"
              onClick={startCamera}
              className="border border-[#999999] bg-white inline-flex min-h-[45px] items-center justify-center px-[6px] py-[3px] text-[9px] font-bold tracking-[0.03em] uppercase hover:bg-[#f8eac7]"
            >
              {cameraState.kind === "ready" ? "[RESTART]" : "[CAMERA]"}
            </button>
          </div>
          <div className="grid min-h-[180px] place-items-center border border-[#999999] bg-[#f8eac7]">
            {photoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoPreview}
                alt="After cleanup"
                className="max-h-[240px] w-full object-cover"
              />
            ) : (
              <video
                ref={videoRef}
                playsInline
                muted
                className="max-h-[240px] w-full object-cover"
              />
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-[6px]">
            <span className="text-[9px] tracking-[0.03em] uppercase">
              {cameraState.kind === "loading"
                ? "CAMERA LOADING"
                : cameraState.kind === "error"
                  ? cameraState.message
                  : photoBlob
                    ? "PHOTO CAPTURED"
                    : "PHOTO REQUIRED"}
            </span>
            <button
              type="button"
              onClick={capturePhoto}
              disabled={cameraState.kind !== "ready"}
              className="border border-[#999999] bg-white inline-flex min-h-[45px] items-center justify-center px-[6px] py-[3px] text-[9px] font-bold tracking-[0.03em] uppercase enabled:hover:bg-[#f8eac7] disabled:text-[#999999]"
            >
              [CAPTURE]
            </button>
          </div>
        </section>

        <section className="grid gap-[6px] border border-[#999999] p-[9px]">
          <div className="flex items-center justify-between gap-[9px]">
            <span className="text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase">
              GPS
            </span>
            <button
              type="button"
              onClick={captureGps}
              className="border border-[#999999] bg-white inline-flex min-h-[45px] items-center justify-center px-[6px] py-[3px] text-[9px] font-bold tracking-[0.03em] uppercase hover:bg-[#f8eac7]"
            >
              {gpsState.kind === "loading" ? "[WAIT]" : "[CAPTURE]"}
            </button>
          </div>
          <p className="text-[9px] tracking-[0.03em] uppercase">
            {gpsState.kind === "error" ? gpsState.message : gpsLabel}
          </p>
          {gpsCapture && gpsCapture.accuracy > MAX_GPS_ACCURACY_M ? (
            <p className="border border-[#a60315] bg-white p-[6px] text-[9px] font-bold tracking-[0.03em] text-[#a60315] uppercase">
              POOR GPS ACCURACY. VERIFICATION MAY FAIL.
            </p>
          ) : null}
        </section>

        <div className="contents" role="status" aria-live="polite">
        {submitState.kind === "verified" ? (
          <div className="border border-[#228B22] bg-white p-[9px] text-[9px] font-bold tracking-[0.03em] text-[#228B22] uppercase">
            LOCATION VERIFIED — SPOT MARKED CLEANED.
            {submitState.pointsAwarded > 0
              ? ` +${submitState.pointsAwarded} POINTS.`
              : ""}
          </div>
        ) : null}

        {submitState.kind === "unverified" ? (
          <div className="border border-[#999999] bg-white p-[9px] text-[9px] font-bold tracking-[0.03em] text-[#999999] uppercase">
            AFTER PHOTO UNVERIFIED — SPOT STATUS UNCHANGED.
          </div>
        ) : null}

        {submitState.kind === "location_mismatch" ? (
          <div className="border border-[#999999] bg-white p-[9px] text-[9px] font-bold tracking-[0.03em] text-[#c7a87d] uppercase">
            GPS DID NOT MATCH SPOT LOCATION — SPOT STATUS UNCHANGED.
          </div>
        ) : null}

        {submitState.kind === "pending" ? (
          <div className="border border-[#999999] bg-white p-[9px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase">
            AFTER PHOTO SUBMITTED — PENDING ADMIN REVIEW.
          </div>
        ) : null}

        {submitState.kind === "failed" ? (
          <div className="border border-[#a60315] bg-white p-[9px] text-[9px] font-bold tracking-[0.03em] text-[#a60315] uppercase">
            {submitState.message}
          </div>
        ) : null}
        </div>

        <button
          type="button"
          onClick={submitCleanup}
          disabled={!canSubmit}
          className="min-h-[45px] border border-[#999999] bg-[#228B22] px-[9px] py-[9px] text-[12px] font-bold tracking-[0.03em] text-white uppercase enabled:hover:opacity-90 disabled:bg-white disabled:text-[#999999]"
        >
          {submitState.kind === "submitting"
            ? "[SUBMITTING]"
            : "[SUBMIT AFTER PHOTO]"}
        </button>
      </div>
    </aside>
    </div>
  );
}
