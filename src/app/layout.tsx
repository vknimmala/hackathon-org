import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SurgeVector Hackathon 2026",
    template: "%s | SurgeVector Hackathon 2026",
  },
  description:
    "Phase 1 MVP registration platform for SurgeVector and Taxila teams.",
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
