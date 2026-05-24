import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CleanLA",
  description: "CleanLA foundation health screen.",
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

