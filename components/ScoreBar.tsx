"use client";

interface Props {
  team1: string;
  team2: string;
  score1: number;
  score2: number;
  minute: number;
  tournament: string;
  isLive: boolean;
}

export default function ScoreBar({ team1, team2, score1, score2, minute, tournament, isLive }: Props) {
  return (
    <div style={{
      background: "var(--bg-card)", border: "0.5px solid var(--border)",
      borderRadius: 10, padding: "14px 20px", marginTop: 12,
    }}>
      <p style={{ fontSize: 11, color: "var(--text-secondary)", textAlign: "center", marginBottom: 10 }}>
        {tournament}
      </p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ flex: 1, textAlign: "right" }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>{team1}</p>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "var(--bg-secondary)", padding: "8px 18px", borderRadius: 8,
        }}>
          <span style={{ fontSize: 26, fontWeight: 700, color: "var(--text-primary)" }}>{score1}</span>
          <span style={{ fontSize: 18, color: "var(--text-secondary)" }}>:</span>
          <span style={{ fontSize: 26, fontWeight: 700, color: "var(--text-primary)" }}>{score2}</span>
        </div>
        <div style={{ flex: 1, textAlign: "left" }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>{team2}</p>
        </div>
      </div>
      <p style={{ fontSize: 12, color: isLive ? "var(--accent)" : "var(--text-secondary)", textAlign: "center", marginTop: 10, fontWeight: 500 }}>
        {isLive ? `⏱ ${minute}'  •  Live` : "Full Time"}
      </p>
    </div>
  );
}
