"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  MAX_GPS_ACCURACY_M,
  REPORT_DESCRIPTION_MAX_LENGTH,
  REPORT_DESCRIPTION_MIN_LENGTH,
  REPORT_SEVERITIES,
} from "@/features/reports/constants";
import { formatCategory } from "@/features/spots/display";
import { SPOT_CATEGORIES, type SpotCategory } from "@/features/spots/types";

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

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className="text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase">
      {children}
    </span>
  );
}

export function ReportSheet({
  onClose,
  onSubmitted,
}: {
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
  const [category, setCategory] = useState<SpotCategory | "">("");
  const [severity, setSeverity] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>({ kind: "idle" });

  const descriptionValid =
    description.trim().length >= REPORT_DESCRIPTION_MIN_LENGTH &&
    description.trim().length <= REPORT_DESCRIPTION_MAX_LENGTH;

  const canSubmit =
    Boolean(photoBlob) &&
    Boolean(photoCapturedAt) &&
    Boolean(gpsCapture) &&
    Boolean(category) &&
    severity !== null &&
    descriptionValid &&
    submitState.kind !== "submitting" &&
    submitState.kind !== "verified" &&
    submitState.kind !== "unverified" &&
    submitState.kind !== "location_mismatch" &&
    submitState.kind !== "pending";

  const gpsLabel = useMemo(() => {
    if (!gpsCapture) return "NO GPS";
    return `${gpsCapture.lat.toFixed(5)}, ${gpsCapture.lng.toFixed(5)} +/- ${Math.round(
      gpsCapture.accuracy,
    )}M`;
  }, [gpsCapture]);

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

  async function submitReport() {
    if (
      !canSubmit ||
      !photoBlob ||
      !gpsCapture ||
      !photoCapturedAt ||
      !category ||
      severity === null
    ) {
      return;
    }

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
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
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

    if (vs === "verified") {
      setSubmitState({ kind: "verified", spotId });
    } else if (vs === "unverified") {
      setSubmitState({ kind: "unverified", spotId, reason: vr });
    } else if (vs === "location_mismatch") {
      setSubmitState({ kind: "location_mismatch", spotId });
    } else {
      setSubmitState({ kind: "pending", spotId });
    }
    onSubmitted();
  }

  return (
    <aside className="absolute right-[9px] bottom-[9px] left-[9px] z-20 max-h-[calc(100vh-108px)] overflow-auto border border-[#999999] bg-white md:left-auto md:w-[420px]">
      <div className="flex h-[27px] items-center justify-between border-b border-[#999999] bg-[#001089] px-[9px]">
        <h2 className="text-[15px] font-bold tracking-[0.03em] text-white uppercase">
          REPORT SPOT
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

      <div className="grid gap-[9px] p-[9px]">
        <section className="grid gap-[6px] border border-[#999999] p-[9px]">
          <div className="flex items-center justify-between gap-[9px]">
            <FieldLabel>LIVE PHOTO</FieldLabel>
            <button
              type="button"
              onClick={startCamera}
              className="border border-[#999999] bg-white px-[6px] py-[3px] text-[9px] font-bold tracking-[0.03em] uppercase hover:bg-[#f8eac7]"
            >
              {cameraState.kind === "ready" ? "[RESTART]" : "[CAMERA]"}
            </button>
          </div>
          <div className="grid min-h-[180px] place-items-center border border-[#999999] bg-[#f8eac7]">
            {photoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoPreview}
                alt="Captured report"
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
              className="border border-[#999999] bg-white px-[6px] py-[3px] text-[9px] font-bold tracking-[0.03em] uppercase enabled:hover:bg-[#f8eac7] disabled:text-[#999999]"
            >
              [CAPTURE]
            </button>
          </div>
        </section>

        <section className="grid gap-[6px] border border-[#999999] p-[9px]">
          <div className="flex items-center justify-between gap-[9px]">
            <FieldLabel>GPS</FieldLabel>
            <button
              type="button"
              onClick={captureGps}
              className="border border-[#999999] bg-white px-[6px] py-[3px] text-[9px] font-bold tracking-[0.03em] uppercase hover:bg-[#f8eac7]"
            >
              {gpsState.kind === "loading" ? "[WAIT]" : "[CAPTURE]"}
            </button>
          </div>
          <p className="text-[9px] tracking-[0.03em] uppercase">
            {gpsState.kind === "error" ? gpsState.message : gpsLabel}
          </p>
          {gpsCapture && gpsCapture.accuracy > MAX_GPS_ACCURACY_M ? (
            <p className="border border-[#a60315] bg-white p-[6px] text-[9px] font-bold tracking-[0.03em] text-[#a60315] uppercase">
              POOR GPS ACCURACY. YOU CAN SUBMIT, BUT VERIFICATION MAY FAIL IN
              PHASE 3.5.
            </p>
          ) : null}
        </section>

        <section className="grid gap-[6px] border border-[#999999] p-[9px]">
          <FieldLabel>CATEGORY</FieldLabel>
          <div className="grid grid-cols-2 gap-[6px]">
            {SPOT_CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`border border-[#999999] px-[6px] py-[6px] text-[9px] font-bold tracking-[0.03em] uppercase ${
                  category === item
                    ? "bg-[#001089] text-white"
                    : "bg-white hover:bg-[#f8eac7]"
                }`}
              >
                {formatCategory(item)}
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-[6px] border border-[#999999] p-[9px]">
          <FieldLabel>SEVERITY</FieldLabel>
          <div className="grid grid-cols-5 gap-[6px]">
            {REPORT_SEVERITIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSeverity(item)}
                className={`border border-[#999999] px-[6px] py-[6px] text-[12px] font-bold ${
                  severity === item
                    ? "bg-[#001089] text-white"
                    : "bg-white hover:bg-[#f8eac7]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-[6px] border border-[#999999] p-[9px]">
          <FieldLabel>DESCRIPTION</FieldLabel>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={REPORT_DESCRIPTION_MAX_LENGTH}
            className="min-h-[72px] border border-[#999999] bg-white p-[6px] text-[12px] leading-relaxed"
          />
          <span
            className={`text-[9px] tracking-[0.03em] uppercase ${descriptionValid ? "" : "text-[#a60315]"}`}
          >
            {description.trim().length}/{REPORT_DESCRIPTION_MAX_LENGTH}{" "}
            CHARACTERS
          </span>
        </section>

        {submitState.kind === "verified" ? (
          <div className="border border-[#228B22] bg-white p-[9px] text-[9px] font-bold tracking-[0.03em] text-[#228B22] uppercase">
            LOCATION VERIFIED ON SITE — SPOT {submitState.spotId} SUBMITTED.
          </div>
        ) : null}

        {submitState.kind === "unverified" ? (
          <div className="border border-[#999999] bg-white p-[9px] text-[9px] font-bold tracking-[0.03em] text-[#999999] uppercase">
            SUBMITTED — LOCATION COULD NOT BE CONFIRMED. SPOT{" "}
            {submitState.spotId} MARKED UNVERIFIED.
          </div>
        ) : null}

        {submitState.kind === "location_mismatch" ? (
          <div className="border border-[#999999] bg-white p-[9px] text-[9px] font-bold tracking-[0.03em] text-[#c7a87d] uppercase">
            SUBMITTED — GPS DID NOT MATCH THE REPORTED SPOT LOCATION. SPOT{" "}
            {submitState.spotId} FLAGGED FOR REVIEW.
          </div>
        ) : null}

        {submitState.kind === "pending" ? (
          <div className="border border-[#999999] bg-white p-[9px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase">
            SPOT {submitState.spotId} SUBMITTED — PENDING REVIEW.
          </div>
        ) : null}

        {submitState.kind === "failed" ? (
          <div className="border border-[#a60315] bg-white p-[9px] text-[9px] font-bold tracking-[0.03em] text-[#a60315] uppercase">
            {submitState.message}
          </div>
        ) : null}

        <button
          type="button"
          onClick={submitReport}
          disabled={!canSubmit}
          className="border border-[#999999] bg-[#001089] px-[9px] py-[9px] text-[12px] font-bold tracking-[0.03em] text-white uppercase enabled:hover:bg-[#94a3d6] disabled:bg-white disabled:text-[#999999]"
        >
          {submitState.kind === "submitting"
            ? "[SUBMITTING]"
            : "[SUBMIT REPORT]"}
        </button>
      </div>
    </aside>
  );
}
