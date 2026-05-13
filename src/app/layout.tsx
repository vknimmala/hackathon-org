import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SurgeVector Hackathon",
    template: "%s | SurgeVector Hackathon",
  },
  description:
    "Internal AI hackathon registration for SurgeVector and Taxilla teams.",
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
