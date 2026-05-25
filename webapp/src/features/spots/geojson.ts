import type { SpotSummary } from "./types";

export type SpotFeatureCollection = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    geometry: {
      type: "Point";
      coordinates: [number, number];
    };
    properties: {
      id: string;
      category: string;
      status: string;
      description: string;
    };
  }>;
};

export function spotsToGeoJson(spots: SpotSummary[]): SpotFeatureCollection {
  return {
    type: "FeatureCollection",
    features: spots.map((spot) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [spot.lng, spot.lat],
      },
      properties: {
        id: spot.id,
        category: spot.category,
        status: spot.status,
        description: spot.description,
      },
    })),
  };
}

