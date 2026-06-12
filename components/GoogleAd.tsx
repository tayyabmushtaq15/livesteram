"use client";
import { useEffect, useRef } from "react";

interface Props {
  slot: string;          // e.g. "1234567890"
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  style?: React.CSSProperties;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function GoogleAd({ slot, format = "auto", style, className }: Props) {
  const adRef = useRef<HTMLElement | null>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") return;
    if (pushed.current) return;

    const adNode = adRef.current;
    if (!adNode) return;

    const status = adNode.getAttribute("data-adsbygoogle-status");
    if (status === "done") return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  // Don't render ads in development
  if (process.env.NODE_ENV === "development") {
    return (
      <div style={{
        background: "var(--bg-card)", border: "1px dashed var(--border)",
        borderRadius: 8, padding: "12px",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--text-secondary)", fontSize: 12,
        minHeight: 90, ...style,
      }} className={className}>
        📢 Google Ad — Slot: {slot} ({format})
      </div>
    );
  }

  return (
    <div style={style} className={className}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
