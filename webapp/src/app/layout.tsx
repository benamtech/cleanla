import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CleanLA — report a street issue",
  description:
    "A public, transparent place to report and view street issues across Los Angeles. Photos, locations, neighborhood tags — all public.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
