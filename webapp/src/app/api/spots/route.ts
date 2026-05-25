import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { SpotSummary } from "@/features/spots/types";

export const dynamic = "force-dynamic";

type BoundsParams = {
  west: number;
  south: number;
  east: number;
  north: number;
  limit: number;
};

function parseNumber(value: string | null): number | null {
  if (value === null || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseBounds(searchParams: URLSearchParams): BoundsParams | { error: string } {
  const west = parseNumber(searchParams.get("west"));
  const south = parseNumber(searchParams.get("south"));
  const east = parseNumber(searchParams.get("east"));
  const north = parseNumber(searchParams.get("north"));
  const requestedLimit = parseNumber(searchParams.get("limit"));

  if (west === null || south === null || east === null || north === null) {
    return { error: "west, south, east, and north are required numeric bounds." };
  }

  if (west < -180 || west > 180 || east < -180 || east > 180) {
    return { error: "longitude bounds must be between -180 and 180." };
  }

  if (south < -90 || south > 90 || north < -90 || north > 90) {
    return { error: "latitude bounds must be between -90 and 90." };
  }

  if (west >= east || south >= north) {
    return { error: "bounds must satisfy west < east and south < north." };
  }

  const limit = Math.min(Math.max(Math.trunc(requestedLimit ?? 500), 1), 500);

  return { west, south, east, north, limit };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const bounds = parseBounds(url.searchParams);

  if ("error" in bounds) {
    return NextResponse.json({ error: bounds.error }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("spots_in_bounds", {
    west: bounds.west,
    south: bounds.south,
    east: bounds.east,
    north: bounds.north,
    result_limit: bounds.limit,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ spots: (data ?? []) as SpotSummary[] });
}
