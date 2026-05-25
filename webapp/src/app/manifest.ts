import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CleanLA",
    short_name: "CleanLA",
    description: "Read-only Los Angeles cleanup map.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#001089",
    icons: [
      {
        src: "/cleanla-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}

