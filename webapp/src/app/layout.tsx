import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "mapbox-gl/dist/mapbox-gl.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "CleanLA - Los Angeles cleanup map",
  description: "A public, read-only map of reported cleanup spots across Los Angeles.",
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
