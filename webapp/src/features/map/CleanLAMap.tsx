"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Image from "next/image";
import type { User } from "@supabase/supabase-js";
import Map, {
  Layer,
  Source,
  type LayerProps,
  type MapEvent,
  type MapMouseEvent,
  type MapRef,
  type ViewStateChangeEvent,
} from "react-map-gl/mapbox";
import type { LngLatBounds } from "mapbox-gl";
import { CleanupSheet } from "@/features/spots/CleanupSheet";
import { ReportSheet } from "@/features/reports/ReportSheet";
import { JuanDemoSheet } from "@/features/profile/JuanDemoSheet";
import { formatPoints, pointsForCategory } from "@/features/points/constants";
import {
  CATEGORY_COLORS,
  formatCategory,
  formatCoordinates,
  formatStatus,
  formatVerification,
} from "@/features/spots/display";
import { spotsToGeoJson } from "@/features/spots/geojson";
import type { SpotSummary } from "@/features/spots/types";
import { createClient } from "@/lib/supabase/client";

// Cosmetic demo mode (NEXT_PUBLIC_DEMO_MODE=true): the [SIGN IN] button
// becomes an @JUAN chip that opens a mock profile. No real session.
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

const LOS_ANGELES_VIEW = {
  longitude: -118.2437,
  latitude: 34.0522,
  zoom: 16,
  pitch: 60,
  bearing: -18,
};

const DEFAULT_BOUNDS = {
  west: -118.67,
  south: 33.7,
  east: -118.15,
  north: 34.34,
};

const clusterLayer: LayerProps = {
  id: "spot-clusters",
  type: "circle",
  filter: ["has", "point_count"],
  paint: {
    "circle-color": "#f8eac7",
    "circle-radius": ["step", ["get", "point_count"], 12, 12, 18, 36, 24],
    "circle-stroke-color": "#999999",
    "circle-stroke-width": 1,
  },
};

const clusterCountLayer: LayerProps = {
  id: "spot-cluster-count",
  type: "symbol",
  filter: ["has", "point_count"],
  layout: {
    "text-field": ["get", "point_count_abbreviated"],
    "text-size": 12,
  },
  paint: {
    "text-color": "#001089",
  },
};

const spotLayer: LayerProps = {
  id: "spot-pins",
  type: "circle",
  filter: ["!", ["has", "point_count"]],
  paint: {
    "circle-color": [
      "match",
      ["get", "category"],
      "illegal_dumping",
      CATEGORY_COLORS.illegal_dumping,
      "trash",
      CATEGORY_COLORS.trash,
      "graffiti",
      CATEGORY_COLORS.graffiti,
      "encampment_debris",
      CATEGORY_COLORS.encampment_debris,
      "biohazard",
      CATEGORY_COLORS.biohazard,
      "overgrowth",
      CATEGORY_COLORS.overgrowth,
      "#001089",
    ],
    "circle-radius": 6,
    "circle-stroke-color": [
      "match",
      ["get", "status"],
      "cleaned",
      "#228B22",
      "#FFFFFF",
    ],
    "circle-stroke-width": [
      "match",
      ["get", "status"],
      "cleaned",
      2,
      1,
    ],
  },
};

type FetchState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ok" }
  | { kind: "error"; message: string };

type AuthNotice =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; message: string };

type MapDirection = "up" | "down" | "left" | "right";

const DESKTOP_PAN_STEP_PX = 120;
const MOBILE_PAN_STEP_PX = 72;
const PITCH_STEP = 3;
const BEARING_STEP = 6;
const CAMERA_DURATION_MS = 120;
const MIN_PITCH = 0;
const MAX_PITCH = 75;

const TAGLINES = [
  "CLEAN VERIFIED SPOTS TO EARN POINTS",
  "REDEEM POINTS AT LOS ANGELES BUSINESSES",
  "CLEAN LOS ANGELES AS A COMMUNITY",
  "@JUAN IS THE TOP CLEANER OF THE MONTH!!!",
];
const TAGLINE_ROTATE_MS = 6000;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function isKeyboardInputTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  return Boolean(
    target.closest("input, textarea, select, button, a, [contenteditable]"),
  );
}

function boundsToQuery(bounds: LngLatBounds): URLSearchParams {
  const params = new URLSearchParams();
  params.set("west", String(bounds.getWest()));
  params.set("south", String(bounds.getSouth()));
  params.set("east", String(bounds.getEast()));
  params.set("north", String(bounds.getNorth()));
  params.set("limit", "500");
  return params;
}

function defaultBoundsQuery(): URLSearchParams {
  const params = new URLSearchParams();
  params.set("west", String(DEFAULT_BOUNDS.west));
  params.set("south", String(DEFAULT_BOUNDS.south));
  params.set("east", String(DEFAULT_BOUNDS.east));
  params.set("north", String(DEFAULT_BOUNDS.north));
  params.set("limit", "500");
  return params;
}

function isSpotResponse(value: unknown): value is { spots: SpotSummary[] } {
  return (
    typeof value === "object" &&
    value !== null &&
    "spots" in value &&
    Array.isArray((value as { spots: unknown }).spots)
  );
}

function StatusPanel({
  fetchState,
  count,
}: {
  fetchState: FetchState;
  count: number;
}) {
  const label =
    fetchState.kind === "loading"
      ? "LOADING"
      : fetchState.kind === "error"
        ? "ERROR"
        : `${count} VISIBLE`;

  return (
    <span
      className={`inline-flex items-center border px-[6px] py-[3px] text-[9px] font-bold tracking-[0.03em] uppercase ${
        fetchState.kind === "error"
          ? "border-[#a60315] bg-[#a60315] text-white"
          : "border-[#001089] bg-[#001089] text-white"
      }`}
    >
      {label}
    </span>
  );
}

function EmptyOrErrorPanel({ fetchState }: { fetchState: FetchState }) {
  if (fetchState.kind === "error") {
    return (
      <div className="border border-[#a60315] bg-white p-[9px] text-[12px] font-bold tracking-[0.03em] text-[#a60315] uppercase">
        {fetchState.message}
      </div>
    );
  }

  return null;
}

function SignInPrompt({
  email,
  notice,
  onEmailChange,
  onSubmit,
  onClose,
}: {
  email: string;
  notice: AuthNotice;
  onEmailChange: (email: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}) {
  return (
    <aside className="absolute right-[calc(9px_+_env(safe-area-inset-right))] bottom-[calc(9px_+_env(safe-area-inset-bottom))] left-[calc(9px_+_env(safe-area-inset-left))] z-20 border border-[#999999] bg-white md:left-auto md:w-[360px]">
      <div className="flex h-[27px] items-center justify-between border-b border-[#999999] bg-[#001089] px-[9px]">
        <h2 className="text-[15px] font-bold tracking-[0.03em] text-white uppercase">
          SIGN IN TO CLEANLA
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="tap-45 flex h-[27px] min-w-[45px] items-center justify-center border border-white bg-white px-[9px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase hover:bg-[#f8eac7]"
          aria-label="Close sign in"
        >
          [x]
        </button>
      </div>
      <div className="grid gap-[9px] p-[9px]">
        <p className="text-[12px] tracking-[0.03em] text-[#001089] uppercase">
          WE EMAIL YOU A ONE-TIME LOGIN LINK. NO PASSWORD.
        </p>
        <input
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder="EMAIL"
          className="border border-[#999999] bg-white p-[9px] text-[12px] tracking-[0.03em] uppercase"
          type="email"
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={notice.kind === "sending" || !email.trim()}
          className="border border-[#999999] bg-[#001089] px-[9px] py-[9px] text-[12px] font-bold tracking-[0.03em] text-white uppercase enabled:hover:bg-[#94a3d6] disabled:bg-white disabled:text-[#999999]"
        >
          {notice.kind === "sending" ? "[SENDING]" : "[EMAIL ME A LOGIN LINK]"}
        </button>
        {notice.kind === "sent" ? (
          <div className="border border-[#228B22] bg-white p-[9px] text-[9px] font-bold tracking-[0.03em] text-[#228B22] uppercase">
            LOGIN LINK SENT. CHECK YOUR EMAIL.
          </div>
        ) : null}
        {notice.kind === "error" ? (
          <div className="border border-[#a60315] bg-white p-[9px] text-[9px] font-bold tracking-[0.03em] text-[#a60315] uppercase">
            {notice.message}
          </div>
        ) : null}
      </div>
    </aside>
  );
}

function SpotDetailSheet({
  spot,
  user,
  onClose,
  onMarkCleaned,
}: {
  spot: SpotSummary;
  user: User | null;
  onClose: () => void;
  onMarkCleaned: () => void;
}) {
  const hasReportPhoto = Boolean(spot.report_media_url);
  const hasCleanPhoto = Boolean(spot.after_media_url);
  const isCleaned = spot.status === "cleaned";
  const cleanupPoints = pointsForCategory(spot.category);
  const showActionButton =
    Boolean(user) && !isCleaned && spot.status !== "hidden";

  // ROOF orchestration: 5 stacked pillars separated by 1px lines.
  //   1. WINDOW BAR   — program identity (27px, fixed)
  //   2. STATUS STRIP — category + status as a single segmented bar (27px, fixed)
  //   3. HERO PHOTO   — aspect 3/4, the visual anchor (fixed by aspect)
  //   4. BODY         — description + clean-section + data table (flex-1, scrolls)
  //   5. ACTION FOOTER — sticky CTA, doesn't scroll with body
  // Sections separate by border, NOT by whitespace gaps.

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center"
      style={{
        paddingTop: "calc(18px + env(safe-area-inset-top))",
        paddingBottom: "calc(18px + env(safe-area-inset-bottom))",
        paddingLeft: "calc(18px + env(safe-area-inset-left))",
        paddingRight: "calc(18px + env(safe-area-inset-right))",
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Spot detail"
    >
      <aside
        className="flex max-h-full w-full max-w-[420px] flex-col overflow-hidden border border-[#999999] bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. WINDOW BAR */}
        <div className="flex h-[27px] shrink-0 items-center justify-between border-b border-[#999999] bg-[#94a3d6] px-[9px]">
          <h2 className="text-[15px] font-bold tracking-[0.03em] text-white uppercase">
            SPOT DETAIL
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="tap-45 flex h-[27px] min-w-[45px] items-center justify-center border border-[#999999] bg-white px-[9px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase hover:bg-[#f8eac7]"
            aria-label="Close spot detail"
          >
            [x]
          </button>
        </div>

        {/* 2. STATUS STRIP — segmented bar, not floating chips */}
        <div className="flex h-[27px] shrink-0 items-stretch border-b border-[#999999]">
          <div
            className="flex flex-1 items-center bg-[#f8eac7] px-[9px]"
            style={{
              borderLeftColor: CATEGORY_COLORS[spot.category],
              borderLeftWidth: "6px",
              borderLeftStyle: "solid",
            }}
          >
            <span className="text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase">
              {formatCategory(spot.category)}
            </span>
          </div>
          <div className="flex items-center border-l border-[#999999] bg-white px-[9px]">
            <span
              className={`text-[9px] font-bold tracking-[0.03em] uppercase ${
                isCleaned ? "text-[#228B22]" : "text-[#001089]"
              }`}
            >
              {formatStatus(spot.status)}
            </span>
          </div>
        </div>

        {/* 3. HERO PHOTO — the visual anchor */}
        <div className="shrink-0 border-b border-[#999999] bg-[#f8eac7]">
          {hasReportPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={spot.report_media_url ?? ""}
              alt={spot.description}
              className="block h-[180px] w-full object-cover sm:h-[240px]"
            />
          ) : (
            <div className="flex h-[180px] items-center justify-center bg-[#f8eac7] text-[12px] font-bold tracking-[0.03em] text-[#999999] uppercase sm:h-[240px]">
              NO REPORT PHOTO
            </div>
          )}
        </div>

        {/* 4. BODY — scrollable; sections stack vertically with no gaps */}
        <div className="flex-1 overflow-auto bg-white">
          {/* Description */}
          <div className="border-b border-[#999999] bg-white px-[9px] py-[9px]">
            <p className="text-[12px] leading-[18px] text-[#001089]">
              {spot.description}
            </p>
          </div>

          {!isCleaned && spot.status !== "hidden" ? (
            <button
              type="button"
              onClick={onMarkCleaned}
              className="block w-full border-b border-[#999999] bg-[#228B22] px-[18px] py-[15px] text-[18px] font-bold tracking-[0.03em] text-white uppercase hover:bg-[#001089]"
            >
              CLEAN THIS TO EARN {formatPoints(cleanupPoints)}
            </button>
          ) : null}

          {/* CLEAN section — only when relevant */}
          {isCleaned || hasCleanPhoto ? (
            <div className="border-b border-[#999999] bg-white">
              <div className="flex h-[24px] items-center border-b border-[#228B22] bg-white px-[9px]">
                <span className="text-[9px] font-bold tracking-[0.03em] text-[#228B22] uppercase">
                  CLEAN
                </span>
              </div>
              {hasCleanPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={spot.after_media_url ?? ""}
                  alt="Cleanup photo"
                  className="block aspect-[3/4] w-full object-cover"
                />
              ) : (
                <div className="flex h-[48px] items-center justify-center bg-white text-[9px] font-bold tracking-[0.03em] text-[#228B22] uppercase">
                  CLEAN — PHOTO PENDING
                </div>
              )}
            </div>
          ) : null}

          {/* Data table — dense rows, no inter-row whitespace */}
          <table className="w-full border-collapse bg-[#f8eac7] text-[9px] tracking-[0.03em] text-[#001089] uppercase">
            <tbody>
              <tr className="border-b border-[#999999]">
                <th className="w-[120px] px-[9px] py-[6px] text-left font-bold">
                  LOCATION
                </th>
                <td className="px-[9px] py-[6px] text-right">
                  {spot.neighborhood ||
                    formatCoordinates(spot.lat, spot.lng)}
                </td>
              </tr>
              <tr className="border-b border-[#999999]">
                <th className="w-[120px] px-[9px] py-[6px] text-left font-bold">
                  VERIFY
                </th>
                <td className="px-[9px] py-[6px] text-right">
                  {formatVerification(spot.verification_status)}
                </td>
              </tr>
              <tr className="border-b border-[#999999]">
                <th className="w-[120px] px-[9px] py-[6px] text-left font-bold">
                  SEVERITY
                </th>
                <td className="px-[9px] py-[6px] text-right">
                  {spot.severity ?? "N/A"}
                </td>
              </tr>
              <tr className="border-b border-[#999999]">
                <th className="w-[120px] px-[9px] py-[6px] text-left font-bold">
                  REPORT
                </th>
                <td className="px-[9px] py-[6px] text-right">
                  {hasReportPhoto ? "PHOTO" : "NONE"}
                </td>
              </tr>
              <tr className="border-b border-[#999999]">
                <th className="w-[120px] px-[9px] py-[6px] text-left font-bold">
                  CLEAN
                </th>
                <td
                  className={`px-[9px] py-[6px] text-right ${
                    isCleaned ? "text-[#228B22]" : ""
                  }`}
                >
                  {hasCleanPhoto ? "PHOTO" : isCleaned ? "PENDING" : "NONE"}
                </td>
              </tr>
              <tr
                className={
                  spot.cleaner_username || isCleaned
                    ? "border-b border-[#999999]"
                    : ""
                }
              >
                <th className="w-[120px] px-[9px] py-[6px] text-left font-bold">
                  REPORTED BY
                </th>
                <td className="px-[9px] py-[6px] text-right">
                  {spot.reporter_username
                    ? `@${spot.reporter_username}`
                    : "ANONYMOUS"}
                </td>
              </tr>
              {spot.cleaner_username || isCleaned ? (
                <tr>
                  <th className="w-[120px] px-[9px] py-[6px] text-left font-bold">
                    CLEANED BY
                  </th>
                  <td className="px-[9px] py-[6px] text-right text-[#228B22]">
                    {spot.cleaner_username
                      ? `@${spot.cleaner_username}`
                      : "ANONYMOUS"}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {/* 5. ACTION FOOTER — sticky bottom, doesn't scroll */}
        {showActionButton ? (
          <button
            type="button"
            onClick={onMarkCleaned}
            className="block shrink-0 border-t border-[#228B22] bg-white px-[9px] py-[12px] text-[15px] font-bold tracking-[0.03em] text-[#228B22] uppercase hover:bg-[#f8eac7]"
          >
            [MARK CLEANED / {formatPoints(cleanupPoints)}]
          </button>
        ) : null}
      </aside>
    </div>
  );
}

function CameraJoystick({
  label,
  caption = "SHIFT",
  compact = false,
  onAdjust,
}: {
  label: string;
  caption?: string | null;
  compact?: boolean;
  onAdjust: (direction: MapDirection) => void;
}) {
  const originRef = useRef<{ x: number; y: number } | null>(null);
  const lastActionRef = useRef(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  function resetJoystick() {
    originRef.current = null;
    setOffset({ x: 0, y: 0 });
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    originRef.current = { x: event.clientX, y: event.clientY };
    lastActionRef.current = 0;
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLButtonElement>) {
    if (!originRef.current) return;

    const dx = event.clientX - originRef.current.x;
    const dy = event.clientY - originRef.current.y;
    const limit = compact ? 18 : 14;
    const visualX = clamp(dx, -limit, limit);
    const visualY = clamp(dy, -limit, limit);
    setOffset({ x: visualX, y: visualY });

    const threshold = compact ? 18 : 12;
    if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return;

    const now = window.performance.now();
    if (now - lastActionRef.current < 30) return;
    lastActionRef.current = now;

    if (Math.abs(dx) > Math.abs(dy)) {
      onAdjust(dx > 0 ? "right" : "left");
    } else {
      onAdjust(dy > 0 ? "down" : "up");
    }
  }

  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={resetJoystick}
      onPointerCancel={resetJoystick}
      className={`relative grid touch-none place-items-center border border-[#999999] bg-white font-bold tracking-[0.03em] text-[#001089] uppercase hover:bg-[#f8eac7] ${
        compact ? "h-[72px] w-[72px]" : "h-[45px] w-[45px]"
      }`}
    >
      {caption ? (
        <span className="absolute top-[6px] text-[9px] text-[#999999]">
          {caption}
        </span>
      ) : null}
      <span
        className={`grid place-items-center border border-[#001089] bg-[#f8eac7] ${
          compact ? "h-[27px] w-[27px]" : "h-[18px] w-[18px]"
        }`}
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
        }}
      >
        <span className={compact ? "text-[12px]" : "text-[9px]"}>+</span>
      </span>
    </button>
  );
}

function MapGameControls({
  onPan,
  onAdjust,
}: {
  onPan: (direction: MapDirection) => void;
  onAdjust: (direction: MapDirection) => void;
}) {
  const moveButtonClass =
    "h-[45px] w-[45px] border border-[#999999] bg-white text-[12px] font-bold tracking-[0.03em] text-[#001089] uppercase hover:bg-[#f8eac7]";

  return (
    <>
      <div className="absolute right-[9px] bottom-[90px] z-10 hidden border border-[#999999] bg-white p-[6px] md:block">
        <div className="mb-[6px] border-b border-[#999999] pb-[6px] text-center text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase">
          WASD MOVE
        </div>
        <div className="grid grid-cols-3 gap-[3px]">
          <div />
          <button
            type="button"
            className={moveButtonClass}
            onClick={() => onPan("up")}
            aria-label="Move map up with W"
          >
            W
          </button>
          <div />
          <button
            type="button"
            className={moveButtonClass}
            onClick={() => onPan("left")}
            aria-label="Move map left with A"
          >
            A
          </button>
          <CameraJoystick label="Drag joystick to pitch or rotate map" onAdjust={onAdjust} />
          <button
            type="button"
            className={moveButtonClass}
            onClick={() => onPan("right")}
            aria-label="Move map right with D"
          >
            D
          </button>
          <div />
          <button
            type="button"
            className={moveButtonClass}
            onClick={() => onPan("down")}
            aria-label="Move map down with S"
          >
            S
          </button>
          <div />
        </div>
      </div>

      <div className="absolute right-[calc(12px_+_env(safe-area-inset-right))] bottom-[calc(90px_+_env(safe-area-inset-bottom))] z-10 md:hidden">
        <CameraJoystick
          compact
          caption={null}
          label="Drag joystick to explore map pitch and rotation"
          onAdjust={onAdjust}
        />
      </div>
    </>
  );
}

function MapLegend() {
  const entries: Array<{ label: string; color: string }> = [
    { label: "ILLEGAL DUMPING", color: CATEGORY_COLORS.illegal_dumping },
    { label: "TRASH", color: CATEGORY_COLORS.trash },
    { label: "GRAFFITI", color: CATEGORY_COLORS.graffiti },
    { label: "ENCAMPMENT DEBRIS", color: CATEGORY_COLORS.encampment_debris },
    { label: "BIOHAZARD", color: CATEGORY_COLORS.biohazard },
    { label: "OVERGROWTH", color: CATEGORY_COLORS.overgrowth },
  ];

  return (
    <aside className="w-[180px] border border-[#999999] bg-white">
      <div className="flex h-[27px] items-center border-b border-[#999999] bg-[#94a3d6] px-[9px]">
        <h2 className="text-[12px] font-bold tracking-[0.03em] text-white uppercase">
          LEGEND
        </h2>
      </div>
      <div className="grid gap-[6px] p-[9px]">
        {entries.map((entry) => (
          <div key={entry.label} className="flex items-center gap-[6px]">
            <span
              className="block h-[12px] w-[12px] shrink-0 border border-[#999999]"
              style={{ backgroundColor: entry.color }}
              aria-hidden="true"
            />
            <span className="text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase">
              {entry.label}
            </span>
          </div>
        ))}
        <div className="mt-[3px] flex items-center gap-[6px] border-t border-[#999999] pt-[6px]">
          <span
            className="block h-[12px] w-[12px] shrink-0 border border-[#228B22] bg-white"
            aria-hidden="true"
          />
          <span className="text-[9px] font-bold tracking-[0.03em] text-[#228B22] uppercase">
            CLEANED (RING)
          </span>
        </div>
      </div>
    </aside>
  );
}

export function CleanLAMap({ mapboxToken }: { mapboxToken: string | null }) {
  const mapRef = useRef<MapRef | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const supabase = useMemo(() => createClient(), []);
  const [spots, setSpots] = useState<SpotSummary[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<SpotSummary | null>(null);
  const [fetchState, setFetchState] = useState<FetchState>({ kind: "idle" });
  const [user, setUser] = useState<User | null>(null);
  const [authNotice, setAuthNotice] = useState<AuthNotice>({ kind: "idle" });
  const [email, setEmail] = useState("");
  const [showSignIn, setShowSignIn] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showCleanup, setShowCleanup] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  // P2-2 cursor state
  const [hoverCursor, setHoverCursor] = useState<"grab" | "pointer">("grab");
  // P1-2 fallback location for GPS-denied case — kept in sync with
  // the map's view center via handleMoveEnd.
  const [currentMapCenter, setCurrentMapCenter] = useState<
    { lat: number; lng: number } | null
  >(null);
  // P2-5 username — fetched after user becomes available so we can
  // show a [SET USERNAME] nudge when one isn't set yet.
  const [username, setUsername] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pointBalance, setPointBalance] = useState<number | null>(null);
  // P2-4 about modal
  const [showAbout, setShowAbout] = useState(false);
  // Rewards preview — opens an in-app modal instead of navigating to /rewards.
  const [showRewards, setShowRewards] = useState(false);
  // Rotating header tagline — cycles every TAGLINE_ROTATE_MS through TAGLINES.
  const [taglineIndex, setTaglineIndex] = useState(0);
  // True while the map is being moved (pan/zoom/rotate); the action-row
  // buttons compact from 45 -> 27px during interaction, then snap back.
  const [isMapInteracting, setIsMapInteracting] = useState(false);
  useEffect(() => {
    const id = setInterval(
      () => setTaglineIndex((i) => (i + 1) % TAGLINES.length),
      TAGLINE_ROTATE_MS,
    );
    return () => clearInterval(id);
  }, []);
  // WebGL availability: null = checking, true = OK, false = unavailable.
  // Mapbox-GL 3.x requires WebGL; without it, the map can't render and
  // mapbox-gl logs "Failed to initialize WebGL" to console. We catch
  // this proactively + render a friendly fallback so the user isn't
  // staring at a blank map area while the console screams.
  const [webglOk, setWebglOk] = useState<boolean | null>(null);
  const spotData = useMemo(() => spotsToGeoJson(spots), [spots]);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setUser(data.session?.user ?? null);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setShowSignIn(false);
        void fetch("/api/profile", { method: "POST" });
      } else {
        setUsername(null);
        setIsAdmin(false);
        setPointBalance(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  // WebGL availability detection on mount. Some browsers throw rather
  // than return null when context creation fails. queueMicrotask
  // satisfies the react-hooks/set-state-in-effect lint rule.
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const canvas = document.createElement("canvas");
        const gl =
          canvas.getContext("webgl2") ?? canvas.getContext("webgl");
        setWebglOk(Boolean(gl));
      } catch {
        setWebglOk(false);
      }
    });
  }, []);

  // P2-5: fetch the username so we can decide whether to show the
  // [SET USERNAME] nudge in the header. Re-runs when user changes.
  useEffect(() => {
    let active = true;
    if (!user) {
      // Defer the setState so the lint rule's no-setState-in-effect
      // check is satisfied (we never want a fresh setState during the
      // effect body's synchronous run; queueMicrotask runs after commit).
      queueMicrotask(() => {
        if (active) {
          setUsername(null);
          setIsAdmin(false);
          setPointBalance(null);
        }
      });
      return () => {
        active = false;
      };
    }
    supabase
      .from("profiles")
      .select("username, is_admin")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (active) {
          setUsername(data?.username ? String(data.username) : null);
          setIsAdmin(Boolean(data?.is_admin));
        }
      });
    fetch("/api/profile/points", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: unknown) => {
        if (
          active &&
          typeof payload === "object" &&
          payload !== null &&
          "balance" in payload &&
          typeof (payload as { balance: unknown }).balance === "number"
        ) {
          setPointBalance((payload as { balance: number }).balance);
        }
      })
      .catch(() => {
        if (active) setPointBalance(null);
      });
    return () => {
      active = false;
    };
  }, [user, supabase]);

  const fetchSpots = useCallback(async (params: URLSearchParams) => {
    setFetchState({ kind: "loading" });
    try {
      const response = await fetch(`/api/spots?${params.toString()}`, {
        cache: "no-store",
      });
      const payload: unknown = await response.json();

      if (!response.ok) {
        const message =
          typeof payload === "object" && payload !== null && "error" in payload
            ? String((payload as { error: unknown }).error)
            : "COULD NOT LOAD SPOTS";
        throw new Error(message);
      }

      if (!isSpotResponse(payload)) {
        throw new Error("SPOT RESPONSE WAS NOT VALID");
      }

      setSpots(payload.spots);
      setFetchState({ kind: "ok" });
    } catch (error) {
      setFetchState({
        kind: "error",
        message:
          error instanceof Error ? error.message : "COULD NOT LOAD SPOTS",
      });
    }
  }, []);

  const scheduleFetch = useCallback(
    (bounds: LngLatBounds) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      const params = boundsToQuery(bounds);
      debounceRef.current = setTimeout(() => {
        void fetchSpots(params);
      }, 300);
    },
    [fetchSpots],
  );

  function handleLoad(event: MapEvent) {
    const bounds = event.target.getBounds();
    if (bounds) {
      void fetchSpots(boundsToQuery(bounds));
    } else {
      void fetchSpots(defaultBoundsQuery());
    }
    // P1-2 seed: capture the initial map center too.
    const center = event.target.getCenter();
    if (center) {
      setCurrentMapCenter({ lat: center.lat, lng: center.lng });
    }
  }

  function handleMoveStart() {
    setIsMapInteracting(true);
  }

  function handleMoveEnd(event: ViewStateChangeEvent) {
    const bounds = event.target.getBounds();
    if (bounds) {
      scheduleFetch(bounds);
    }
    // P1-2: keep the fallback location in sync so the ReportSheet has
    // a usable lat/lng when the browser denies GPS.
    const center = event.target.getCenter();
    if (center) {
      setCurrentMapCenter({ lat: center.lat, lng: center.lng });
    }
    setIsMapInteracting(false);
  }

  function refetchCurrentBounds() {
    const bounds = mapRef.current?.getBounds();
    void fetchSpots(bounds ? boundsToQuery(bounds) : defaultBoundsQuery());
  }

  const panMap = useCallback((direction: MapDirection) => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const center = map.getCenter();
    const point = map.project(center);
    const step =
      window.innerWidth < 768 ? MOBILE_PAN_STEP_PX : DESKTOP_PAN_STEP_PX;
    const dx = direction === "left" ? -step : direction === "right" ? step : 0;
    const dy = direction === "up" ? -step : direction === "down" ? step : 0;
    const nextCenter = map.unproject([point.x + dx, point.y + dy]);

    mapRef.current?.easeTo({
      center: [nextCenter.lng, nextCenter.lat],
      duration: CAMERA_DURATION_MS,
    });
  }, []);

  const adjustCamera = useCallback((direction: MapDirection) => {
    const map = mapRef.current;
    if (!map) return;

    const currentPitch = map.getPitch();
    const currentBearing = map.getBearing();

    map.jumpTo({
      pitch:
        direction === "up"
          ? clamp(currentPitch + PITCH_STEP, MIN_PITCH, MAX_PITCH)
          : direction === "down"
            ? clamp(currentPitch - PITCH_STEP, MIN_PITCH, MAX_PITCH)
            : currentPitch,
      bearing:
        direction === "left"
          ? currentBearing - BEARING_STEP
          : direction === "right"
            ? currentBearing + BEARING_STEP
            : currentBearing,
    });
  }, []);

  async function sendMagicLink() {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    setAuthNotice({ kind: "sending" });
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOtp({
      email: trimmedEmail,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      setAuthNotice({ kind: "error", message: error.message.toUpperCase() });
      return;
    }

    setAuthNotice({ kind: "sent" });
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setShowReport(false);
    setShowCleanup(false);
  }

  function openReport() {
    setSelectedSpot(null);
    setShowCleanup(false);
    // Lazy auth: open the report sheet for everyone. The post-submit
    // screen offers an optional sign-in to claim the report for your
    // contributor score. No pre-report friction.
    setShowSignIn(false);
    setShowReport(true);
  }

  // P2-1: Escape closes any open overlay. Standard desktop expectation.
  // Doesn't close the report sheet — that has its own handler so the
  // user can dismiss it independently of other overlays.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (selectedSpot) {
        setSelectedSpot(null);
        return;
      }
      if (showCleanup) {
        setShowCleanup(false);
        return;
      }
      if (showSignIn) {
        setShowSignIn(false);
        return;
      }
      if (showLegend) {
        setShowLegend(false);
        return;
      }
      if (showAbout) {
        setShowAbout(false);
        return;
      }
      if (showRewards) {
        setShowRewards(false);
        return;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedSpot, showCleanup, showSignIn, showLegend, showAbout, showRewards]);

  useEffect(() => {
    const overlaysOpen =
      Boolean(selectedSpot) || showReport || showCleanup || showSignIn || showAbout || showRewards;

    function onKey(e: KeyboardEvent) {
      if (overlaysOpen || isKeyboardInputTarget(e.target)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const directionByKey: Record<string, MapDirection> = {
        w: "up",
        a: "left",
        s: "down",
        d: "right",
      };
      const direction = directionByKey[e.key.toLowerCase()];
      if (!direction) return;

      e.preventDefault();
      if (e.shiftKey) {
        adjustCamera(direction);
      } else {
        panMap(direction);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    adjustCamera,
    panMap,
    selectedSpot,
    showAbout,
    showCleanup,
    showReport,
    showRewards,
    showSignIn,
  ]);

  function handleMapClick(event: MapMouseEvent) {
    const feature = event.features?.[0];
    if (!feature) return;

    const properties = feature.properties ?? {};

    if (properties.cluster) {
      const geometry = feature.geometry;
      if (
        geometry.type === "Point" &&
        Array.isArray(geometry.coordinates) &&
        geometry.coordinates.length >= 2
      ) {
        const [lng, lat] = geometry.coordinates as [number, number];
        mapRef.current?.easeTo({
          center: [lng, lat],
          zoom: Math.min(
            (mapRef.current.getZoom() ?? LOS_ANGELES_VIEW.zoom) + 2,
            16,
          ),
          duration: 300,
        });
      }
      return;
    }

    const id = typeof properties.id === "string" ? properties.id : null;
    if (!id) return;

    const spot = spots.find((item) => item.id === id);
    if (spot) {
      mapRef.current?.easeTo({
        center: [spot.lng, spot.lat],
        zoom: Math.max(mapRef.current.getZoom() ?? LOS_ANGELES_VIEW.zoom, 17),
        duration: 400,
      });
      setShowCleanup(false);
      setShowReport(false);
      setSelectedSpot(spot);
    }
  }

  if (!mapboxToken) {
    return (
      <main className="min-h-[100dvh] bg-white p-[18px]">
        <section className="mx-auto max-w-[720px] border border-[#a60315] bg-white p-[18px]">
          <div className="mb-[9px] border-b border-[#999999] pb-[9px]">
            <h1 className="text-[24px] font-bold tracking-[0.03em] text-[#a60315] uppercase">
              MAPBOX TOKEN MISSING
            </h1>
          </div>
          <p className="text-[12px] tracking-[0.03em] text-[#001089] uppercase">
            SET NEXT_PUBLIC_MAPBOX_TOKEN TO LOAD THE CLEANLA MAP.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="relative h-[100dvh] overflow-hidden bg-white text-[#001089] md:min-h-[540px]">
      {webglOk === false ? (
        <div className="absolute inset-0 grid place-items-center bg-[#f8eac7] p-[18px]">
          <div className="w-full max-w-[480px] border border-[#a60315] bg-white">
            <div className="flex h-[27px] items-center border-b border-[#999999] bg-[#a60315] px-[9px]">
              <h2 className="text-[15px] font-bold tracking-[0.03em] text-white uppercase">
                MAP UNAVAILABLE · WEBGL REQUIRED
              </h2>
            </div>
            <div className="grid gap-[12px] p-[12px] text-[12px] leading-[18px] tracking-[0.03em] text-[#001089] uppercase">
              <p>
                THE MAP USES WEBGL TO RENDER LA. YOUR BROWSER HAS WEBGL
                DISABLED OR YOUR DEVICE DOES NOT SUPPORT IT.
              </p>
              <div className="border border-[#999999] bg-[#f8eac7] p-[9px]">
                <p className="font-bold">TO FIX (CHROME):</p>
                <p className="mt-[6px]">
                  SETTINGS → SYSTEM → ENABLE
                  &ldquo;USE HARDWARE ACCELERATION WHEN AVAILABLE&rdquo; →
                  RESTART CHROME.
                </p>
              </div>
              <div className="border border-[#999999] bg-[#f8eac7] p-[9px]">
                <p className="font-bold">CHECK YOUR GPU STATUS:</p>
                <p className="mt-[6px]">
                  OPEN A NEW TAB AND VISIT{" "}
                  <code className="bg-white px-[3px] text-[12px] font-bold text-[#001089]">
                    chrome://gpu/
                  </code>{" "}
                  · LOOK FOR &ldquo;WEBGL: HARDWARE ACCELERATED&rdquo;.
                </p>
              </div>
              <p className="text-[9px] text-[#999999]">
                YOU CAN STILL FILE A REPORT BELOW · IT DOES NOT NEED THE
                MAP TO WORK.
              </p>
            </div>
          </div>
        </div>
      ) : (
      <Map
        ref={mapRef}
        mapboxAccessToken={mapboxToken}
        initialViewState={LOS_ANGELES_VIEW}
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        minZoom={8}
        maxZoom={17}
        onLoad={handleLoad}
        onMoveStart={handleMoveStart}
        onMoveEnd={handleMoveEnd}
        onClick={handleMapClick}
        interactiveLayerIds={["spot-clusters", "spot-pins"]}
        // P2-2: cursor reflects affordance — pointer when hovering pins,
        // grab otherwise. react-map-gl exposes this via the cursor prop
        // tied to feature-state via onMouseEnter/Leave below.
        cursor={hoverCursor}
        onMouseEnter={() => setHoverCursor("pointer")}
        onMouseLeave={() => setHoverCursor("grab")}
        // P2-6: pad the bottom 81px so flyTo/fitBounds frames pins in the
        // area NOT occluded by the big FILE A REPORT CTA. Doesn't shrink
        // the map's drawing area; only affects auto-camera-positioning.
        padding={{ top: 96, bottom: 96, left: 12, right: 12 }}
        // Full interaction: drag-pan, scroll-zoom, double-click-zoom,
        // drag-rotate, pitch-with-rotate, touch-pitch, touch-zoom-rotate.
        // react-map-gl defaults most of these on; touchPitch is the
        // notable exception — enabling it lets users 2-finger drag up
        // to pitch the camera on mobile, matching what the user asked for.
        dragPan
        dragRotate
        pitchWithRotate
        touchPitch
        touchZoomRotate
        scrollZoom
        doubleClickZoom
        keyboard
        style={{ width: "100%", height: "100%" }}
      >
        <Source
          id="spots"
          type="geojson"
          data={spotData}
          cluster={true}
          clusterMaxZoom={13}
          clusterRadius={36}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...spotLayer} />
        </Source>
      </Map>
      )}

      <header className="absolute top-[calc(9px_+_env(safe-area-inset-top))] right-[calc(9px_+_env(safe-area-inset-right))] left-[calc(9px_+_env(safe-area-inset-left))] z-10 border border-[#999999] bg-white md:right-auto md:w-[420px]">
        <div className="flex h-[27px] items-center justify-between border-b border-[#999999] bg-[#94a3d6] px-[9px]">
          <h1 className="text-[15px] font-bold tracking-[0.03em] text-white uppercase">
            CLEANLA MAP
          </h1>
          <span className="inline-flex items-center border border-white px-[6px] py-[3px] text-[9px] font-bold tracking-[0.03em] text-white uppercase">
            {user ? "SIGNED IN" : "PUBLIC"}
          </span>
        </div>
        <div className="flex h-[27px] items-center justify-between gap-[9px] border-b border-[#999999] bg-[#f8eac7] px-[9px]">
          <p className="truncate text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase">
            {TAGLINES[taglineIndex]}
          </p>
          <StatusPanel fetchState={fetchState} count={spots.length} />
        </div>
        <div
          className={`nav-row flex flex-wrap items-stretch border-b border-[#999999] bg-white ${
            isMapInteracting ? "is-compact" : ""
          }`}
        >
          <button
            type="button"
            onClick={() => setShowLegend((current) => !current)}
            className="inline-flex min-h-[45px] grow items-center justify-center border-r border-[#999999] bg-white px-[9px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase hover:bg-[#f8eac7]"
          >
            [LEGEND]
          </button>
            {user ? (
              <a
                href="/profile"
                className="inline-flex min-h-[45px] grow items-center justify-center border-r border-[#999999] bg-white px-[9px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase no-underline hover:bg-[#f8eac7]"
              >
                [PROFILE]
              </a>
            ) : null}
            <button
              type="button"
              onClick={() => setShowRewards(true)}
              className="inline-flex min-h-[45px] grow items-center justify-center border-r border-[#999999] bg-white px-[9px] text-[9px] font-bold tracking-[0.03em] text-[#228B22] uppercase hover:bg-[#f8eac7]"
            >
              <span>[REWARDS]</span>
              {user && pointBalance !== null ? (
                <span className="ml-[6px] inline-flex items-center border border-[#228B22] px-[6px] py-[3px] text-[9px] font-bold tracking-[0.03em] text-[#228B22] uppercase">
                  {formatPoints(pointBalance)}
                </span>
              ) : null}
            </button>
            {user && isAdmin ? (
              <a
                href="/admin"
                className="inline-flex min-h-[45px] grow items-center justify-center border-r border-[#999999] bg-[#f8eac7] px-[9px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase no-underline hover:bg-[#b8dae8]"
              >
                [ADMIN]
              </a>
            ) : null}
            {user && !username ? (
              <a
                href="/profile"
                className="inline-flex min-h-[45px] grow items-center justify-center border-r border-[#999999] bg-[#f8eac7] px-[9px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase no-underline hover:bg-[#b8dae8]"
              >
                [SET USERNAME]
              </a>
            ) : null}
            {user ? (
              <button
                type="button"
                onClick={signOut}
                className="inline-flex min-h-[45px] grow items-center justify-center border-r border-[#999999] bg-white px-[9px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase hover:bg-[#f8eac7]"
              >
                [SIGN OUT]
              </button>
            ) : DEMO_MODE ? (
              <button
                type="button"
                onClick={() => setShowProfile(true)}
                className="inline-flex min-h-[45px] grow items-center justify-center border-r border-[#999999] bg-[#228B22] px-[9px] text-[9px] font-bold tracking-[0.03em] text-white uppercase hover:bg-[#001089]"
              >
                @JUAN
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowSignIn(true)}
                className="inline-flex min-h-[45px] grow items-center justify-center border-r border-[#999999] bg-white px-[9px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase hover:bg-[#f8eac7]"
              >
                [SIGN IN]
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowAbout(true)}
              aria-label="About CleanLA"
              className="inline-flex min-h-[45px] grow items-center justify-center bg-white px-[9px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase hover:bg-[#f8eac7]"
            >
              [i]
            </button>
        </div>
      </header>

      {/* P1-4: empty-viewport encouragement. Renders above the CTA when
          a fetch resolved with zero spots in the current bounds. */}
      {fetchState.kind === "ok" && spots.length === 0 ? (
        <div className="pointer-events-none fixed right-[12px] bottom-[calc(84px_+_env(safe-area-inset-bottom))] left-[12px] z-10">
          <div className="border border-[#999999] bg-[#f8eac7] p-[9px] text-center text-[12px] font-bold tracking-[0.03em] text-[#001089] uppercase">
            NO REPORTS HERE YET · BE THE FIRST
          </div>
        </div>
      ) : null}

      {/* P1-5 cleanup hint — floats on the map ABOVE the bottom bar
          so it doesn't get pushed off-screen by the bar's full-width
          dominance. mix-blend-difference keeps it legible over any
          underlying map tile color. */}
      {/* Primary CTA — edge-to-edge bottom bar in warning red. Maximum
          possible visibility within the 369 system:
            - text-[36px] is the top of the type scale
            - py-[48px] makes it ~132px tall (~1 inch on a phone)
            - tracking-[0.06em] gives the caps commanding weight
            - warning red #a60315 is the loudest single color in the
              8-token palette (the user explicitly pushed past the
              "navy is the conservative choice" framing — visibility wins)
            - inset-x-0 bottom-0 removes all gutters; full-bleed sticky
              bottom bar pattern (think iOS-app tab bar position)
            - 1px top border in grey reads as a "sticky footer" rather
              than a floating button, anchoring it to the screen edge */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-10"
        style={{
          paddingLeft: "calc(12px + env(safe-area-inset-left))",
          paddingRight: "calc(12px + env(safe-area-inset-right))",
          paddingTop: "12px",
          paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
        }}
      >
        <button
          type="button"
          onClick={openReport}
          className="pointer-events-auto block w-full border border-[#999999] bg-[#a60315] px-[18px] py-[18px] text-[24px] font-bold tracking-[0.03em] text-white uppercase hover:bg-[#001089]"
        >
          [+] FILE A REPORT
        </button>
      </div>

      {webglOk ? (
        <MapGameControls onPan={panMap} onAdjust={adjustCamera} />
      ) : null}

      <div className="absolute top-[calc(141px_+_env(safe-area-inset-top))] right-[calc(9px_+_env(safe-area-inset-right))] z-10 grid gap-[9px] md:top-[9px]">
        {showLegend ? <MapLegend /> : null}
      </div>

      <div className="absolute right-[calc(12px_+_env(safe-area-inset-right))] bottom-[calc(171px_+_env(safe-area-inset-bottom))] z-10 grid justify-items-end md:bottom-[calc(270px_+_env(safe-area-inset-bottom))] md:right-[calc(9px_+_env(safe-area-inset-right))]">
        <button
          type="button"
          className="h-[45px] w-[45px] border border-[#999999] bg-white text-[12px] font-bold tracking-[0.03em] text-[#001089] uppercase hover:bg-[#f8eac7]"
          onClick={() => mapRef.current?.zoomIn({ duration: 100 })}
          aria-label="Zoom in"
        >
          [+]
        </button>
        <button
          type="button"
          className="h-[45px] w-[45px] border-x border-b border-[#999999] bg-white text-[12px] font-bold tracking-[0.03em] text-[#001089] uppercase hover:bg-[#f8eac7]"
          onClick={() => mapRef.current?.zoomOut({ duration: 100 })}
          aria-label="Zoom out"
        >
          [-]
        </button>
      </div>

      {fetchState.kind === "error" ? (
        <div className="absolute top-[150px] left-[9px] z-10 w-[300px]">
          <EmptyOrErrorPanel fetchState={fetchState} />
        </div>
      ) : null}

      {selectedSpot && !showCleanup ? (
        <SpotDetailSheet
          spot={selectedSpot}
          user={user}
          onClose={() => setSelectedSpot(null)}
          onMarkCleaned={() => setShowCleanup(true)}
        />
      ) : null}

      {showSignIn ? (
        <SignInPrompt
          email={email}
          notice={authNotice}
          onEmailChange={setEmail}
          onSubmit={sendMagicLink}
          onClose={() => setShowSignIn(false)}
        />
      ) : null}

      {showProfile ? (
        <JuanDemoSheet onClose={() => setShowProfile(false)} />
      ) : null}

      {showReport ? (
        <ReportSheet
          onClose={() => setShowReport(false)}
          onSubmitted={({ lat, lng }) => {
            refetchCurrentBounds();
            // P1-3: closes the evaluation gulf — user sees their new
            // pin appear and the camera zooms to it within 1 second
            // of the success. The padding={{bottom: 81}} on <Map>
            // ensures the pin lands above the CTA, not behind it.
            mapRef.current?.flyTo({
              center: [lng, lat],
              zoom: Math.max(mapRef.current.getZoom() ?? 12, 16),
              duration: 800,
            });
          }}
          isSignedIn={Boolean(user)}
          fallbackLocation={currentMapCenter}
        />
      ) : null}

      {/* P2-4: About / disclaimer modal. Legal posture per
          wiki/concepts/civic-app-legal-considerations.md — making the
          unofficial status visible to first-time visitors. */}
      {showAbout ? (
        <div
          className="fixed inset-0 z-20 grid place-items-center"
          style={{
            paddingTop: "calc(9px + env(safe-area-inset-top))",
            paddingBottom: "calc(9px + env(safe-area-inset-bottom))",
            paddingLeft: "calc(9px + env(safe-area-inset-left))",
            paddingRight: "calc(9px + env(safe-area-inset-right))",
          }}
          onClick={() => setShowAbout(false)}
          role="dialog"
          aria-modal="true"
          aria-label="About CleanLA"
        >
          <aside
            className="max-h-full w-full max-w-[420px] overflow-auto border border-[#999999] bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-[27px] items-center justify-between border-b border-[#999999] bg-[#94a3d6] px-[9px]">
              <h2 className="text-[15px] font-bold tracking-[0.03em] text-white uppercase">
                ABOUT CLEANLA
              </h2>
              <button
                type="button"
                onClick={() => setShowAbout(false)}
                className="tap-45 flex h-[27px] min-w-[45px] items-center justify-center border border-[#999999] bg-white px-[9px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase hover:bg-[#f8eac7]"
                aria-label="Close about"
              >
                [x]
              </button>
            </div>
            <div className="grid gap-[9px] p-[9px] text-[12px] leading-[18px] tracking-[0.03em] text-[#001089] uppercase">
              <p>
                CLEANLA IS AN INDEPENDENT CIVIC TRANSPARENCY APP. REPORTS
                ARE PUBLIC. THIS IS NOT AN OFFICIAL CITY SERVICE.
              </p>
              <p>
                FOR OFFICIAL LA REQUESTS, FILE AT{" "}
                <a
                  href="https://myla311.lacity.gov"
                  className="font-bold text-[#001089] underline hover:bg-[#f8eac7]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  MYLA311.LACITY.GOV
                </a>
                .
              </p>
              <p>
                EVERY SUBMITTED PHOTO IS REVIEWED BY AI MODERATION BEFORE
                IT APPEARS PUBLICLY. FLAGGED CONTENT IS HIDDEN PENDING
                HUMAN REVIEW.
              </p>
              <p>
                NONPARTISAN · OPEN SOURCE ·{" "}
                <a
                  href="https://github.com/benamtech/cleanla"
                  className="font-bold text-[#001089] underline hover:bg-[#f8eac7]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GITHUB.COM/BENAMTECH/CLEANLA
                </a>
              </p>
            </div>
          </aside>
        </div>
      ) : null}

      {showRewards ? (
        <div
          className="fixed inset-0 z-20 grid place-items-center"
          style={{
            paddingTop: "calc(9px + env(safe-area-inset-top))",
            paddingBottom: "calc(9px + env(safe-area-inset-bottom))",
            paddingLeft: "calc(9px + env(safe-area-inset-left))",
            paddingRight: "calc(9px + env(safe-area-inset-right))",
          }}
          onClick={() => setShowRewards(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Local rewards"
        >
          <aside
            className="max-h-full w-full max-w-[420px] overflow-auto border border-[#999999] bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-[27px] items-center justify-between border-b border-[#999999] bg-[#228B22] px-[9px]">
              <h2 className="text-[15px] font-bold tracking-[0.03em] text-white uppercase">
                LOCAL REWARDS
              </h2>
              <button
                type="button"
                onClick={() => setShowRewards(false)}
                className="tap-45 flex h-[27px] min-w-[45px] items-center justify-center border border-white bg-white px-[9px] text-[9px] font-bold tracking-[0.03em] text-[#228B22] uppercase hover:bg-[#f8eac7]"
                aria-label="Close rewards"
              >
                [x]
              </button>
            </div>

            <div className="border-b border-[#999999] bg-[#f8eac7] px-[9px] py-[6px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase">
              {user && pointBalance !== null
                ? `YOUR BALANCE · ${formatPoints(pointBalance)}`
                : "CLEAN VERIFIED SPOTS TO EARN POINTS · REDEEM POINTS AT LOS ANGELES BUSINESSES"}
            </div>

            <article className="border-b border-[#999999]">
              <div className="relative h-[180px] border-b border-[#999999] bg-[#f8eac7]">
                <Image
                  src="/langers.jpg"
                  alt="Langer's Delicatessen storefront, MacArthur Park, Los Angeles"
                  fill
                  sizes="420px"
                  className="object-cover"
                />
              </div>
              <p className="border-b border-[#999999] bg-white px-[9px] py-[3px] text-[9px] tracking-[0.03em] text-[#999999] uppercase">
                PHOTO: JOSH LIM (SKY HARBOR) ·{" "}
                <a
                  href="https://commons.wikimedia.org/wiki/File:Langer%27s_Deli_from_Langer%27s_Square_(cropped).jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#999999]"
                >
                  CC BY-SA 4.0
                </a>
              </p>
              <div className="grid gap-[6px] px-[9px] py-[9px]">
                <p className="text-[9px] font-bold tracking-[0.03em] text-[#999999] uppercase">
                  LANGER&apos;S DELICATESSEN · DELI · MACARTHUR PARK
                </p>
                <h3 className="text-[18px] font-bold tracking-[0.03em] text-[#001089] uppercase">
                  FREE FOUNTAIN DRINK WITH ANY SANDWICH
                </h3>
                <p className="text-[12px] leading-[18px] text-[#001089]">
                  Home of the world-famous #19 hot pastrami. Serving Westlake
                  since 1947 at 704 S Alvarado St.
                </p>
                <p>
                  <span className="inline-flex items-center border border-[#228B22] px-[6px] py-[3px] text-[12px] font-bold tracking-[0.03em] text-[#228B22] uppercase">
                    200 POINTS
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowRewards(false);
                  if (!user) setShowSignIn(true);
                }}
                className="block min-h-[45px] w-full border-t border-[#228B22] bg-white px-[9px] py-[12px] text-[12px] font-bold tracking-[0.03em] text-[#228B22] uppercase hover:bg-[#f8eac7]"
              >
                {user ? "[CLAIM REWARD]" : "[SIGN IN TO CLAIM]"}
              </button>
            </article>

            <div className="px-[9px] py-[6px] text-[9px] font-bold tracking-[0.03em] text-[#999999] uppercase">
              PREVIEW · MORE LA BUSINESSES COMING SOON
            </div>
          </aside>
        </div>
      ) : null}

      {showCleanup && selectedSpot && user ? (
        <CleanupSheet
          spotId={selectedSpot.id}
          spotDescription={selectedSpot.description}
          onClose={() => setShowCleanup(false)}
          onSubmitted={() => {
            setShowCleanup(false);
            setSelectedSpot(null);
            refetchCurrentBounds();
          }}
        />
      ) : null}
    </main>
  );
}
