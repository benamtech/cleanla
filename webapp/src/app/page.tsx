import { CleanLAMap } from "@/features/map/CleanLAMap";
import { getMapboxToken } from "@/lib/mapbox/env";

export const dynamic = "force-dynamic";

export default function Home() {
  return <CleanLAMap mapboxToken={getMapboxToken()} />;
}
