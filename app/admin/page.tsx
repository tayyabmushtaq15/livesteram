"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

interface StreamConfig {
  youtubeUrl: string;
  matchTitle: string;
  team1: string;
  team2: string;
  score1: number;
  score2: number;
  minute: number;
  isLive: boolean;
  tournament: string;
}

export default function AdminPage() {
  const [config, setConfig] = useState<StreamConfig>({
    youtubeUrl: "", matchTitle: "", team1: "", team2: "",
    score1: 0, score2: 0, minute: 0, isLive: true, tournament: "",
  });
  const [adminKey, setAdminKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    fetch("/api/stream").then((r) => r.json()).then(setConfig).catch(() => {});
  }, []);

  async function save() {
    if (!adminKey) { setMsg({ text: "Admin key daalo", ok: false }); return; }
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...config, adminKey }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ text: "✅ Saved! Changes live ho gaye.", ok: true });
        setConfig(data.config);
      } else {
        setMsg({ text: `❌ ${data.error || "Error"}`, ok: false });
      }
    } catch {
      setMsg({ text: "❌ Network error", ok: false });
    }
    setSaving(false);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "var(--bg-secondary)",
    border: "0.5px solid var(--border)", borderRadius: 8,
    color: "var(--text-primary)", fontSize: 14,
    padding: "10px 14px", outline: "none", marginTop: 6,
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 12, color: "var(--text-secondary)", fontWeight: 500,
  };
  const fieldStyle: React.CSSProperties = { marginBottom: 16 };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Navbar />
      <main style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px" }}>
        <div style={{
          background: "var(--bg-card)", border: "0.5px solid var(--border)",
          borderRadius: 12, padding: "24px",
        }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: "var(--text-primary)" }}>
            Admin Panel
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 24 }}>
            Add youtube link and match details here.
          </p>

          <div style={fieldStyle}>
            <label style={labelStyle}>YouTube Live URL *</label>
            <input style={inputStyle} value={config.youtubeUrl}
              onChange={(e) => setConfig({ ...config, youtubeUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..." />
            <p style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>
              Paste the YouTube live stream link here.
            </p>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Tournament</label>
            <input style={inputStyle} value={config.tournament}
              onChange={(e) => setConfig({ ...config, tournament: e.target.value })}
              placeholder="FIFA World Cup 2026" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Team 1</label>
              <input style={inputStyle} value={config.team1}
                onChange={(e) => setConfig({ ...config, team1: e.target.value })}
                placeholder="Argentina 🇦🇷" />
            </div>
            <div>
              <label style={labelStyle}>Team 2</label>
              <input style={inputStyle} value={config.team2}
                onChange={(e) => setConfig({ ...config, team2: e.target.value })}
                placeholder="France 🇫🇷" />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Score 1</label>
              <input style={inputStyle} type="number" min="0" value={config.score1}
                onChange={(e) => setConfig({ ...config, score1: Number(e.target.value) })} />
            </div>
            <div>
              <label style={labelStyle}>Score 2</label>
              <input style={inputStyle} type="number" min="0" value={config.score2}
                onChange={(e) => setConfig({ ...config, score2: Number(e.target.value) })} />
            </div>
            <div>
              <label style={labelStyle}>Minute</label>
              <input style={inputStyle} type="number" min="0" max="120" value={config.minute}
                onChange={(e) => setConfig({ ...config, minute: Number(e.target.value) })} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <label style={labelStyle}>Match Live Hai?</label>
            <button
              onClick={() => setConfig({ ...config, isLive: !config.isLive })}
              style={{
                background: config.isLive ? "var(--accent)" : "var(--bg-secondary)",
                border: "0.5px solid var(--border)", borderRadius: 20,
                color: config.isLive ? "#fff" : "var(--text-secondary)",
                padding: "5px 16px", fontSize: 13, cursor: "pointer", fontWeight: 500,
              }}
            >
              {config.isLive ? "🔴 LIVE" : "⚫ Offline"}
            </button>
          </div>

          <div style={{ borderTop: "0.5px solid var(--border)", paddingTop: 20, marginBottom: 16 }}>
            <label style={labelStyle}>Admin Password *</label>
            <input style={inputStyle} type="password" value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="**********" />
            <p style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>
              This is required to make changes to the match details.
            </p>
          </div>

          {msg && (
            <div style={{
              background: msg.ok ? "#1d9e7522" : "#e24b4a22",
              border: `0.5px solid ${msg.ok ? "#1d9e75" : "#e24b4a"}`,
              borderRadius: 8, padding: "10px 14px",
              fontSize: 13, color: msg.ok ? "#1d9e75" : "#e24b4a",
              marginBottom: 16,
            }}>
              {msg.text}
            </div>
          )}

          <button
            onClick={save}
            disabled={saving}
            style={{
              width: "100%", background: saving ? "var(--bg-secondary)" : "var(--accent)",
              border: "none", borderRadius: 8, color: "#fff",
              padding: "12px", fontSize: 15, fontWeight: 600,
              cursor: saving ? "not-allowed" : "pointer", transition: "background 0.2s",
            }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div style={{
          background: "var(--bg-card)", border: "0.5px solid var(--border)",
          borderRadius: 12, padding: "16px 20px", marginTop: 16,
        }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>
            💡 How to use
          </p>
          <ul style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.8, paddingLeft: 16 }}>
            <li>Open any live youtube video link</li>
            <li>Copy the URL (youtube.com/watch?v=...)</li>
            <li>Paste it here and save</li>
            <li>stream will be updated automatically on main page</li>
            <li>Update score and match details from here.</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
