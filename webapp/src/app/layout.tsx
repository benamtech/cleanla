import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "mapbox-gl/dist/mapbox-gl.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "CleanLA - Los Angeles cleanup map",
  description: "A public, read-only map of reported cleanup spots across Los Angeles.",
  appleWebApp: {
    capable: true,
    title: "CleanLA",
    // Transparent status bar so the map renders edge-to-edge behind it;
    // content is kept clear of it via env(safe-area-inset-top).
    statusBarStyle: "black-translucent",
  },
  // Phone numbers / addresses in user reports shouldn't be auto-linked by iOS.
  formatDetection: { telephone: false },
};

// viewportFit: "cover" is required for env(safe-area-inset-*) to resolve to
// real values on notch / Dynamic Island / home-indicator devices. Without it
// every safe-area inset is 0 and the layout draws under the hardware.
// userScalable stays enabled (WCAG 1.4.4) — we do NOT trade accessibility for
// the iOS focus-zoom on <16px inputs.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#001089",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
