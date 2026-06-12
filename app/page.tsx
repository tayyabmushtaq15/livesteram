"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";
import ScoreBar from "@/components/ScoreBar";
import ChatBox from "@/components/ChatBox";
import GoogleAd from "@/components/GoogleAd";
import { supabase, StreamConfig } from "@/lib/supabase";

const AD_SLOTS = {
  belowVideo: process.env.NEXT_PUBLIC_AD_SLOT_BELOW_VIDEO || "1111111111",
  sidebar:    process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR     || "2222222222",
  bottom:     process.env.NEXT_PUBLIC_AD_SLOT_BOTTOM      || "3333333333",
};

export default function Home() {
  const [config, setConfig] = useState<StreamConfig | null>(null);
  const [loading, setLoading] = useState(true);

  // Initial load
  useEffect(() => {
    fetch("/api/stream")
      .then((r) => r.json())
      .then((data) => { setConfig(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Realtime — admin ne kuch change kiya toh sab users ko turant update
  useEffect(() => {
    const channel = supabase
      .channel("stream_config_changes")
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "stream_config",
        filter: "id=eq.1",
      }, (payload) => {
        if (payload.new) {
          setConfig(payload.new as StreamConfig);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 40, height: 40, border: "3px solid var(--border)",
          borderTop: "3px solid var(--accent)", borderRadius: "50%",
          animation: "spin 0.8s linear infinite", margin: "0 auto 12px",
        }}/>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Loading match...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  if (!config) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "var(--text-secondary)" }}>Stream load nahi ho saka. Refresh karo.</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Navbar />
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 16px 32px" }}>
        <div className="main-grid">
          <div>
            <VideoPlayer youtubeUrl={config.youtubeUrl} isLive={config.isLive} />
            <ScoreBar
              team1={config.team1} team2={config.team2}
              score1={config.score1} score2={config.score2}
              minute={config.minute} tournament={config.tournament}
              isLive={config.isLive}
            />
            <GoogleAd slot={AD_SLOTS.belowVideo} format="horizontal"
              style={{ marginTop: 14, minHeight: 90, borderRadius: 8, overflow: "hidden" }} />
          </div>

          <div className="right-col">
            <div style={{ height: 460 }}><ChatBox /></div>
            <GoogleAd slot={AD_SLOTS.sidebar} format="rectangle"
              style={{ marginTop: 12, minHeight: 120, borderRadius: 8, overflow: "hidden" }} />
          </div>
        </div>

        <GoogleAd slot={AD_SLOTS.bottom} format="auto"
          style={{ marginTop: 20, minHeight: 90, borderRadius: 8, overflow: "hidden" }} />
      </main>

      <style>{`
        .main-grid { display: grid; grid-template-columns: 1fr min(360px, 38%); gap: 16px; align-items: start; }
        .right-col { display: flex; flex-direction: column; }
        @media (max-width: 768px) {
          .main-grid { grid-template-columns: 1fr !important; }
          .right-col { height: auto !important; }
        }
      `}</style>
    </div>
  );
}
