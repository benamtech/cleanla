import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  formatCategory,
  formatStatus,
  formatVerification,
} from "@/features/spots/display";
import type { SpotCategory, SpotStatus, VerificationStatus } from "@/features/spots/types";
import { ShareActions } from "@/features/sharing/ShareActions";

export const dynamic = "force-dynamic";

type Spot = {
  id: string;
  category: SpotCategory;
  status: SpotStatus;
  description: string;
  neighborhood: string | null;
  severity: number | null;
  created_at: string;
  verification_status: VerificationStatus;
};

type SpotMedia = {
  id: string;
  media_url: string;
  media_kind: string;
  verification_status: VerificationStatus;
};

async function fetchSpot(id: string): Promise<Spot | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("spots")
    .select("id, category, status, description, neighborhood, severity, created_at, verification_status")
    .eq("id", id)
    .single();
  return data ?? null;
}

async function fetchApprovedMedia(spotId: string): Promise<SpotMedia[]> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("spot_media")
    .select("id, media_url, media_kind, verification_status")
    .eq("spot_id", spotId)
    .eq("moderation_status", "approved")
    .order("created_at", { ascending: true });
  return data ?? [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const spot = await fetchSpot(id);

  if (!spot || spot.status === "hidden") {
    return { robots: { index: false, follow: false } };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const title = `${formatCategory(spot.category)} · ${spot.neighborhood ?? "Los Angeles"} · CleanLA`;
  const description = spot.description.slice(0, 160);
  const ogImage = `${siteUrl}/api/og/spot/${id}`;
  const pageUrl = `${siteUrl}/s/${id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      url: pageUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      images: [ogImage],
    },
    alternates: { canonical: pageUrl },
  };
}

export default async function SpotPublicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [spot, media] = await Promise.all([fetchSpot(id), fetchApprovedMedia(id)]);

  if (!spot || spot.status === "hidden" || media.length === 0) {
    notFound();
  }

  const reportPhoto = media.find((m) => m.media_kind === "report" || m.media_kind === "before");
  const afterPhoto = media.find((m) => m.media_kind === "after");
  const isCleaned = spot.status === "cleaned" && !!afterPhoto;
  const isVerified = spot.verification_status === "verified";

  const headerBg = isCleaned ? "bg-[#228B22]" : "bg-[#94a3d6]";

  const submittedDate = new Date(spot.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-[100dvh] bg-white safe-top safe-x">
      {/* Window bar */}
      <div
        className={`h-[27px] flex items-center justify-between px-[9px] border-b border-[#999999] ${headerBg}`}
      >
        <span className="text-[15px] font-bold text-white uppercase tracking-[0.03em]">
          {formatCategory(spot.category)}
        </span>
        <span className="text-[9px] font-bold text-white uppercase tracking-[0.03em] opacity-75">
          {formatStatus(spot.status)}
        </span>
      </div>

      <div className="p-[18px] grid gap-[18px] max-w-[900px] mx-auto">

        {/* Photos */}
        {isCleaned && reportPhoto && afterPhoto ? (
          // Cleanup layout — before + after side by side
          <div className="flex gap-[6px]">
            <div className="flex-1 grid gap-[3px]">
              <span className="text-[9px] font-bold uppercase tracking-[0.03em] text-[#999999]">
                BEFORE
              </span>
              <div className="border border-[#999999] aspect-[4/3] relative overflow-hidden">
                <Image
                  src={reportPhoto.media_url}
                  alt="Before photo"
                  fill
                  className="object-cover"
                  sizes="(max-width: 900px) 50vw, 450px"
                />
              </div>
            </div>
            <div className="flex-1 grid gap-[3px]">
              <span className="text-[9px] font-bold uppercase tracking-[0.03em] text-[#228B22]">
                AFTER
              </span>
              <div className="border border-[#228B22] aspect-[4/3] relative overflow-hidden">
                <Image
                  src={afterPhoto.media_url}
                  alt="After photo"
                  fill
                  className="object-cover"
                  sizes="(max-width: 900px) 50vw, 450px"
                />
              </div>
            </div>
          </div>
        ) : reportPhoto ? (
          // Problem-spot layout — single report photo
          <div className="grid gap-[3px]">
            <span className="text-[9px] font-bold uppercase tracking-[0.03em] text-[#999999]">
              PHOTO
            </span>
            <div className="border border-[#999999] aspect-[4/3] relative overflow-hidden">
              <Image
                src={reportPhoto.media_url}
                alt="Report photo"
                fill
                className="object-cover"
                sizes="(max-width: 900px) 100vw, 900px"
              />
            </div>
          </div>
        ) : null}

        {/* Metadata */}
        <div className="grid gap-[9px]">
          {/* Verified badge */}
          {isVerified && (
            <div>
              <span className="border border-[#228B22] px-[6px] py-[3px] text-[9px] font-bold uppercase tracking-[0.03em] text-[#228B22]">
                ✓︎ LOCATION VERIFIED
              </span>
            </div>
          )}

          {/* Field rows */}
          <div className="grid gap-[6px]">
            {spot.neighborhood && (
              <div className="flex gap-[9px] items-baseline border-b border-[#999999] pb-[6px]">
                <span className="text-[9px] font-bold uppercase tracking-[0.03em] text-[#999999] w-[90px] shrink-0">
                  NEIGHBORHOOD
                </span>
                <span className="text-[12px] text-[#001089]">{spot.neighborhood}</span>
              </div>
            )}

            {spot.severity !== null && (
              <div className="flex gap-[9px] items-baseline border-b border-[#999999] pb-[6px]">
                <span className="text-[9px] font-bold uppercase tracking-[0.03em] text-[#999999] w-[90px] shrink-0">
                  SEVERITY
                </span>
                <span className="text-[12px] text-[#001089]">
                  {"★︎".repeat(spot.severity)}{"☆︎".repeat(5 - spot.severity)}
                </span>
              </div>
            )}

            <div className="flex gap-[9px] items-baseline border-b border-[#999999] pb-[6px]">
              <span className="text-[9px] font-bold uppercase tracking-[0.03em] text-[#999999] w-[90px] shrink-0">
                SUBMITTED
              </span>
              <span className="text-[12px] text-[#001089]">{submittedDate}</span>
            </div>

            <div className="flex gap-[9px] items-baseline border-b border-[#999999] pb-[6px]">
              <span className="text-[9px] font-bold uppercase tracking-[0.03em] text-[#999999] w-[90px] shrink-0">
                VERIFIED
              </span>
              <span className="text-[12px] text-[#001089]">
                {formatVerification(spot.verification_status)}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="border border-[#999999] p-[9px]">
            <p className="text-[12px] leading-[18px] text-[#001089]">{spot.description}</p>
          </div>
        </div>

        {/* Share actions */}
        <div className="border-t border-[#999999] pt-[18px]">
          <ShareActions
            spotId={id}
            category={spot.category}
            neighborhood={spot.neighborhood}
            status={spot.status}
          />
        </div>

        {/* CleanLA footer */}
        <div className="border-t border-[#999999] pt-[9px]">
          <span className="text-[9px] uppercase tracking-[0.03em] text-[#999999]">
            CLEANLA — CIVIC CLEANUP MAP FOR LOS ANGELES
          </span>
        </div>
      </div>
    </div>
  );
}
