import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { Suspense } from "react";
import MetaPixel from "@/components/MetaPixel";

export const metadata: Metadata = {
  title: "LiveSport — Watch Live Matches",
  description: "Watch live football matches, FIFA World Cup streams, and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  return (
    <html lang="en">
      <head>
        {/* Google AdSense — apna publisher ID .env mein set karo */}
        {adsenseClient && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body>
        {/* Meta Pixel */}
        {metaPixelId && (
          <Suspense fallback={null}>
            <MetaPixel pixelId={metaPixelId} />
          </Suspense>
        )}
        {children}
      </body>
    </html>
  );
}
