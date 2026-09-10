import React from 'react';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BhuScore — Land Parcel Credit Bureau',
  description: "India's Land Parcel Credit Bureau keyed by ULPIN, geo-polygons, ownership chains, CERSAI encumbrance charges, eCourts litigation history, risk scoring and automated watchlist alerts.",
  openGraph: {
    title: 'BhuScore — Land Parcel Credit Bureau',
    description: "India's Land Parcel Credit Bureau keyed by ULPIN, geo-polygons, ownership chains, CERSAI encumbrance charges, eCourts litigation history, risk scoring and automated watchlist alerts.",
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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500/20 selection:text-emerald-800">
        {children}
      </body>
    </html>
  );
}
