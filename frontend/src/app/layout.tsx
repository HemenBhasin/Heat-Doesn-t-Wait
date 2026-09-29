import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Heat Doesn't Wait — Ward-Level Heat Vulnerability Evidence Platform",
  description:
    "A geospatial AI/ML platform that detects urban heat hotspots at ward level, computes Land Surface Temperature, and generates equity-weighted evidence reports to support Heat Action Plans across Indian cities.",
  keywords: [
    "urban heat island",
    "heat hotspot detection",
    "land surface temperature",
    "NDVI",
    "NDBI",
    "heat equity",
    "random forest",
    "geospatial AI",
    "heat action plan",
    "ward level analysis",
  ],
  openGraph: {
    title: "Heat Doesn't Wait",
    description:
      "AI-powered ward-level heat vulnerability evidence platform for Indian cities",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
