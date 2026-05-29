import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow loading the dev server over the Tailscale / LAN IP (preview on phone).
  // Next 16 blocks cross-origin dev resources (HMR, /_next/*) by default.
  allowedDevOrigins: ["100.88.85.119", "192.168.1.96"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;

