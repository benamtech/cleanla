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
          SIGN IN TO REPORT
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
          PUBLIC MAP BROWSING STAYS OPEN. REPORTING REQUIRES A MAGIC LINK.
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
          {notice.kind === "sending" ? "[SENDING]" : "[SEND MAGIC LINK]"}
        </button>
        {notice.kind === "sent" ? (
          <div className="border border-[#228B22] bg-white p-[9px] text-[9px] font-bold tracking-[0.03em] text-[#228B22] uppercase">
            MAGIC LINK SENT. CHECK YOUR EMAIL.
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
  return (
    <div
      className="fixed inset-0 z-10 grid place-items-center p-[9px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Spot detail"
    >
      <aside
        className="max-h-[calc(100vh-18px)] w-full max-w-[420px] overflow-auto border border-[#999999] bg-white"
        onClick={(e) => e.stopPropagation()}
      >
      <div className="flex h-[27px] items-center justify-between border-b border-[#999999] bg-[#94a3d6] px-[9px]">
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
      <div className="grid gap-[9px] p-[9px]">
        <div className="flex flex-wrap gap-[6px]">
          <span
            className="border-y border-r border-l-[6px] border-[#999999] bg-[#f8eac7] px-[6px] py-[3px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase"
            style={{ borderLeftColor: CATEGORY_COLORS[spot.category] }}
          >
            {formatCategory(spot.category)}
          </span>
          <span className="border border-[#999999] bg-white px-[6px] py-[3px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase">
            {formatStatus(spot.status)}
          </span>
        </div>

        <p className="text-[12px] leading-relaxed text-[#001089]">
          {spot.description}
        </p>

        <div className="grid gap-[6px] border border-[#999999] bg-[#f8eac7] p-[9px] text-[9px] tracking-[0.03em] text-[#001089] uppercase">
          <div className="flex justify-between gap-[12px]">
            <span className="font-bold">LOCATION</span>
            <span>
              {spot.neighborhood || formatCoordinates(spot.lat, spot.lng)}
            </span>
          </div>
          <div className="flex justify-between gap-[12px]">
            <span className="font-bold">VERIFY</span>
            <span>{formatVerification(spot.verification_status)}</span>
          </div>
          <div className="flex justify-between gap-[12px]">
            <span className="font-bold">SEVERITY</span>
            <span>{spot.severity ?? "N/A"}</span>
          </div>
          <div className="flex justify-between gap-[12px]">
            <span className="font-bold">BEFORE</span>
            <span>{spot.report_media_url ? "PHOTO" : "NONE"}</span>
          </div>
          <div className="flex justify-between gap-[12px]">
            <span className="font-bold">AFTER</span>
            <span>{spot.after_media_url ? "PHOTO" : "NONE"}</span>
          </div>
        </div>

        {spot.report_media_url ? (
          <div className="grid gap-[6px]">
            <p className="text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase">
              BEFORE
            </p>
            <div className="border border-[#999999] bg-[#f8eac7] p-[6px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={spot.report_media_url}
                alt={spot.description}
                className="block max-h-[180px] w-full object-cover"
              />
            </div>
          </div>
        ) : (
          <div className="border border-[#999999] bg-[#f8eac7] p-[18px] text-center text-[9px] font-bold tracking-[0.03em] text-[#999999] uppercase">
            NO BEFORE PHOTO
          </div>
        )}

        {spot.after_media_url ? (
          <div className="grid gap-[6px]">
            <p className="text-[9px] font-bold tracking-[0.03em] text-[#228B22] uppercase">
              AFTER
            </p>
            <div className="border border-[#228B22] bg-[#f8eac7] p-[6px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={spot.after_media_url}
                alt="After cleanup"
                className="block max-h-[180px] w-full object-cover"
              />
            </div>
          </div>
        ) : spot.status === "cleaned" ? (
          <div className="border border-[#228B22] bg-white p-[9px] text-[9px] font-bold tracking-[0.03em] text-[#228B22] uppercase">
            CLEANED — AFTER PHOTO PENDING
          </div>
        ) : null}

        {user &&
        spot.status !== "cleaned" &&
        spot.status !== "hidden" ? (
          <button
            type="button"
            onClick={onMarkCleaned}
            className="border border-[#228B22] bg-white px-[9px] py-[9px] text-[12px] font-bold tracking-[0.03em] text-[#228B22] uppercase hover:bg-[#f8eac7]"
          >
            [MARK CLEANED]
          </button>
        ) : null}
      </div>
      </aside>
    </div>
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
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

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
  }

  function handleMoveEnd(event: ViewStateChangeEvent) {
    const bounds = event.target.getBounds();
    if (bounds) {
      scheduleFetch(bounds);
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
    if (user) {
      setShowSignIn(false);
      setShowReport(true);
    } else {
      setShowReport(false);
      setShowSignIn(true);
    }
  }

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
        cursor="crosshair"
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
            <button
              type="button"
              onClick={openReport}
              className="border border-[#999999] bg-white px-[9px] py-[6px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase hover:bg-[#f8eac7]"
            >
              [REPORT]
            </button>
            {user ? (
              <a
                href="/profile"
                className="border border-[#999999] bg-white px-[9px] py-[6px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase hover:bg-[#f8eac7]"
              >
                [PROFILE]
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
            ) : null}
          </div>
        </div>
      </header>

      <div className="absolute top-[90px] right-[9px] z-10 grid gap-[6px]">
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

      {showReport && user ? (
        <ReportSheet
          onClose={() => setShowReport(false)}
          onSubmitted={refetchCurrentBounds}
        />
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
