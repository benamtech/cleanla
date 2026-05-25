import { ImageResponse } from "next/og";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatCategory, formatStatus } from "@/features/spots/display";
import type { SpotCategory, SpotStatus, VerificationStatus } from "@/features/spots/types";

export const dynamic = "force-dynamic";

type Spot = {
  id: string;
  category: SpotCategory;
  status: SpotStatus;
  description: string;
  neighborhood: string | null;
  verification_status: VerificationStatus;
};

type SpotMedia = {
  id: string;
  media_url: string;
  media_kind: string;
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const admin = createAdminClient();

  const [{ data: spot }, { data: mediaRows }] = await Promise.all([
    admin
      .from("spots")
      .select("id, category, status, description, neighborhood, verification_status")
      .eq("id", id)
      .single(),
    admin
      .from("spot_media")
      .select("id, media_url, media_kind")
      .eq("spot_id", id)
      .eq("moderation_status", "approved")
      .order("created_at", { ascending: true }),
  ]);

  if (!spot || spot.status === "hidden" || !mediaRows || mediaRows.length === 0) {
    return new Response(null, { status: 404 });
  }

  const media = mediaRows as SpotMedia[];
  const reportPhoto = media.find((m) => m.media_kind === "report" || m.media_kind === "before");
  const afterPhoto = media.find((m) => m.media_kind === "after");
  const isCleaned = spot.status === "cleaned" && !!afterPhoto;
  const isVerified = (spot as Spot).verification_status === "verified";

  // Load Inter Bold for Satori (system fonts are unavailable in the renderer)
  let fontData: ArrayBuffer | null = null;
  try {
    const fontRes = await fetch(
      "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2",
    );
    fontData = await fontRes.arrayBuffer();
  } catch {
    // Font fetch failed — Satori will use its built-in fallback
  }

  const categoryLabel = formatCategory((spot as Spot).category);
  const statusLabel = formatStatus((spot as Spot).status);
  const neighborhood = (spot as Spot).neighborhood ?? "Los Angeles";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 1200,
          height: 630,
          backgroundColor: "#FFFFFF",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* TOP STRIP — 60px */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 60,
            backgroundColor: "#001089",
            padding: "0 18px",
          }}
        >
          <span
            style={{
              color: "#FFFFFF",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "0.03em",
              textTransform: "uppercase",
            }}
          >
            CLEANLA
          </span>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
            <span
              style={{
                color: "#FFFFFF",
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "0.03em",
                textTransform: "uppercase",
              }}
            >
              {categoryLabel}
            </span>
            <span
              style={{
                color: "#FFFFFF",
                fontSize: 12,
                letterSpacing: "0.03em",
                textTransform: "uppercase",
                opacity: 0.75,
              }}
            >
              {neighborhood.toUpperCase()} {isVerified ? "· ✓ VERIFIED" : ""}
            </span>
          </div>
        </div>

        {/* MIDDLE — photos, flex:1 */}
        <div style={{ display: "flex", flex: 1 }}>
          {isCleaned && reportPhoto && afterPhoto ? (
            // Cleanup variant: before | after
            <>
              <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={reportPhoto.media_url}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 6,
                    left: 9,
                    color: "#FFFFFF",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.03em",
                    textTransform: "uppercase",
                    backgroundColor: "#001089",
                    padding: "3px 6px",
                  }}
                >
                  BEFORE
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  overflow: "hidden",
                  position: "relative",
                  borderLeft: "3px solid #228B22",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={afterPhoto.media_url}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 6,
                    left: 9,
                    color: "#FFFFFF",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.03em",
                    textTransform: "uppercase",
                    backgroundColor: "#228B22",
                    padding: "3px 6px",
                  }}
                >
                  AFTER
                </div>
              </div>
            </>
          ) : reportPhoto ? (
            // Problem-spot variant: full-width report photo
            <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={reportPhoto.media_url}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 9,
                  right: 9,
                  color: "#FFFFFF",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.03em",
                  textTransform: "uppercase",
                  backgroundColor: "#a60315",
                  padding: "3px 6px",
                }}
              >
                {statusLabel}
              </div>
            </div>
          ) : (
            // No photo fallback (shouldn't reach here due to 404 guard above)
            <div
              style={{
                display: "flex",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f8eac7",
              }}
            >
              <span style={{ color: "#999999", fontSize: 12, textTransform: "uppercase" }}>
                NO PHOTO
              </span>
            </div>
          )}
        </div>

        {/* BOTTOM STRIP — 80px, kept clear for X title overlay */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: 80,
            backgroundColor: "#001089",
            opacity: 0.9,
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      ...(fontData
        ? { fonts: [{ name: "Inter", data: fontData, weight: 700 }] }
        : {}),
    },
  );
}
