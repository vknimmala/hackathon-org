import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "HackVector by SurgeVector",
    template: "%s | HackVector by SurgeVector",
  },
  description:
    "Phase 1 MVP registration platform for HackVector by SurgeVector.",
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
