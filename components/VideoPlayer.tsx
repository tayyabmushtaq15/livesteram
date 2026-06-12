"use client";
import { useEffect, useRef } from "react";

interface Props {
  youtubeUrl: string;
  isLive: boolean;
}

function getYouTubeId(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1);
    return u.searchParams.get("v") || url;
  } catch {
    return url;
  }
}

export default function VideoPlayer({ youtubeUrl, isLive }: Props) {
  const videoId = getYouTubeId(youtubeUrl);

  return (
    <div style={{ width: "100%", position: "relative" }}>
      {isLive && (
        <div style={{
          position: "absolute", top: 12, left: 12, zIndex: 10,
          background: "var(--accent)", color: "#fff",
          fontSize: 11, fontWeight: 700, padding: "3px 10px",
          borderRadius: 4, letterSpacing: 1, display: "flex", alignItems: "center", gap: 5,
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: "50%",
            background: "#fff", display: "inline-block",
            animation: "pulse 1.5s ease-in-out infinite",
          }}/>
          LIVE
        </div>
      )}
      <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: 10, background: "#000" }}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding=1`}
          title="Live Match Stream"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: "absolute", top: 0, left: 0,
            width: "100%", height: "100%",
            border: "none",
          }}
        />
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
