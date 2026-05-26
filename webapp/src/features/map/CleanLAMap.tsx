"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

const LOS_ANGELES_VIEW = {
  longitude: -118.2437,
  latitude: 34.0522,
  zoom: 10.5,
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
    <div className="border border-[#999999] bg-white px-[9px] py-[6px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase">
      {label}
    </div>
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
    <aside className="absolute right-[9px] bottom-[9px] left-[9px] z-20 border border-[#999999] bg-white md:left-auto md:w-[360px]">
      <div className="flex h-[27px] items-center justify-between border-b border-[#999999] bg-[#001089] px-[9px]">
        <h2 className="text-[15px] font-bold tracking-[0.03em] text-white uppercase">
          SIGN IN TO CLEANLA
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="border border-white bg-white px-[6px] py-[3px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase hover:bg-[#f8eac7]"
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
      className="fixed inset-0 z-10 flex items-center justify-center p-[18px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Spot detail"
    >
      <aside
        className="flex h-[calc(100vh-36px)] w-full max-w-[420px] flex-col overflow-hidden border border-[#999999] bg-white"
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
            className="border border-[#999999] bg-white px-[6px] py-[3px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase hover:bg-[#f8eac7]"
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
              className="block aspect-[3/4] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[3/4] items-center justify-center bg-[#f8eac7] text-[12px] font-bold tracking-[0.03em] text-[#999999] uppercase">
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
            [MARK CLEANED]
          </button>
        ) : null}
      </aside>
    </div>
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
            className="block h-[12px] w-[12px] shrink-0 border-[2px] border-[#228B22] bg-white"
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
  const [showReport, setShowReport] = useState(false);
  const [showCleanup, setShowCleanup] = useState(false);
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
  // P2-4 about modal
  const [showAbout, setShowAbout] = useState(false);
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
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  // P2-5: fetch the username so we can decide whether to show the
  // [SET USERNAME] nudge in the header. Re-runs when user changes.
  useEffect(() => {
    let active = true;
    if (!user) {
      // Defer the setState so the lint rule's no-setState-in-effect
      // check is satisfied (we never want a fresh setState during the
      // effect body's synchronous run; queueMicrotask runs after commit).
      queueMicrotask(() => {
        if (active) setUsername(null);
      });
      return () => {
        active = false;
      };
    }
    supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (active && data?.username) {
          setUsername(String(data.username));
        }
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
  }

  function refetchCurrentBounds() {
    const bounds = mapRef.current?.getBounds();
    void fetchSpots(bounds ? boundsToQuery(bounds) : defaultBoundsQuery());
  }

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
      if (showAbout) {
        setShowAbout(false);
        return;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedSpot, showCleanup, showSignIn, showAbout]);

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
      setShowCleanup(false);
      setShowReport(false);
      setSelectedSpot(spot);
    }
  }

  if (!mapboxToken) {
    return (
      <main className="min-h-screen bg-white p-[18px]">
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
    <main className="relative h-screen min-h-[540px] overflow-hidden bg-white text-[#001089]">
      <Map
        ref={mapRef}
        mapboxAccessToken={mapboxToken}
        initialViewState={LOS_ANGELES_VIEW}
        mapStyle="mapbox://styles/mapbox/standard"
        minZoom={8}
        maxZoom={17}
        onLoad={handleLoad}
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
        padding={{ top: 90, bottom: 144, left: 12, right: 12 }}
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

      <header className="absolute top-[9px] right-[9px] left-[9px] z-10 border border-[#999999] bg-white">
        <div className="flex h-[27px] items-center justify-between border-b border-[#999999] bg-[#94a3d6] px-[9px]">
          <h1 className="text-[15px] font-bold tracking-[0.03em] text-white uppercase">
            CLEANLA MAP
          </h1>
          <span className="text-[9px] tracking-[0.03em] text-white uppercase">
            {user ? "SIGNED IN" : "PUBLIC"}
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-[9px] p-[9px]">
          <p className="text-[12px] tracking-[0.03em] text-[#001089] uppercase">
            LOS ANGELES PUBLIC SPOTS
          </p>
          <div className="flex flex-wrap items-center gap-[6px]">
            <StatusPanel fetchState={fetchState} count={spots.length} />
            {user ? (
              <a
                href="/profile"
                className="border border-[#999999] bg-white px-[9px] py-[6px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase hover:bg-[#f8eac7]"
              >
                [PROFILE]
              </a>
            ) : null}
            {user && !username ? (
              <a
                href="/profile"
                className="border border-[#999999] bg-[#f8eac7] px-[9px] py-[6px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase no-underline hover:bg-[#b8dae8]"
              >
                [SET USERNAME]
              </a>
            ) : null}
            {user ? (
              <button
                type="button"
                onClick={signOut}
                className="border border-[#999999] bg-white px-[9px] py-[6px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase hover:bg-[#f8eac7]"
              >
                [SIGN OUT]
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowSignIn(true)}
                className="border border-[#999999] bg-white px-[9px] py-[6px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase hover:bg-[#f8eac7]"
              >
                [SIGN IN]
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowAbout(true)}
              aria-label="About CleanLA"
              className="border border-[#999999] bg-white px-[9px] py-[6px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase hover:bg-[#f8eac7]"
            >
              [i]
            </button>
          </div>
        </div>
      </header>

      {/* P1-4: empty-viewport encouragement. Renders above the CTA when
          a fetch resolved with zero spots in the current bounds. */}
      {fetchState.kind === "ok" && spots.length === 0 ? (
        <div className="pointer-events-none absolute right-[12px] bottom-[174px] left-[12px] z-10">
          <div className="border border-[#999999] bg-[#f8eac7] p-[9px] text-center text-[12px] font-bold tracking-[0.03em] text-[#001089] uppercase">
            NO REPORTS HERE YET · BE THE FIRST
          </div>
        </div>
      ) : null}

      {/* P1-5 cleanup hint — floats on the map ABOVE the bottom bar
          so it doesn't get pushed off-screen by the bar's full-width
          dominance. mix-blend-difference keeps it legible over any
          underlying map tile color. */}
      <div className="pointer-events-none absolute right-[12px] bottom-[150px] left-[12px] z-10">
        <p className="text-center text-[9px] font-bold tracking-[0.03em] text-white uppercase mix-blend-difference">
          OR TAP ANY PIN TO MARK IT CLEANED
        </p>
      </div>

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
      <div className="absolute inset-x-0 bottom-0 z-10 border-t border-[#999999]">
        <button
          type="button"
          onClick={openReport}
          className="block w-full bg-[#a60315] px-[18px] py-[48px] text-[36px] font-bold tracking-[0.06em] text-white uppercase hover:bg-[#001089]"
        >
          [+] FILE A REPORT
        </button>
      </div>

      <div className="absolute top-[90px] right-[9px] z-10 grid gap-[9px]">
        <MapLegend />
        <div className="grid justify-items-end gap-[6px]">
          <button
            type="button"
            className="border border-[#999999] bg-white px-[9px] py-[6px] text-[12px] font-bold tracking-[0.03em] text-[#001089] uppercase hover:bg-[#f8eac7]"
            onClick={() => mapRef.current?.zoomIn({ duration: 100 })}
            aria-label="Zoom in"
          >
            [+]
          </button>
          <button
            type="button"
            className="border border-[#999999] bg-white px-[9px] py-[6px] text-[12px] font-bold tracking-[0.03em] text-[#001089] uppercase hover:bg-[#f8eac7]"
            onClick={() => mapRef.current?.zoomOut({ duration: 100 })}
            aria-label="Zoom out"
          >
            [-]
          </button>
        </div>
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
          className="fixed inset-0 z-20 grid place-items-center p-[9px]"
          onClick={() => setShowAbout(false)}
          role="dialog"
          aria-modal="true"
          aria-label="About CleanLA"
        >
          <aside
            className="max-h-[calc(100vh-18px)] w-full max-w-[420px] overflow-auto border border-[#999999] bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-[27px] items-center justify-between border-b border-[#999999] bg-[#94a3d6] px-[9px]">
              <h2 className="text-[15px] font-bold tracking-[0.03em] text-white uppercase">
                ABOUT CLEANLA
              </h2>
              <button
                type="button"
                onClick={() => setShowAbout(false)}
                className="border border-[#999999] bg-white px-[6px] py-[3px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase hover:bg-[#f8eac7]"
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
