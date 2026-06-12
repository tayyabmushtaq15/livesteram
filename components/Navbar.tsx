"use client";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.remove("light");
    } else {
      root.classList.add("light");
    }
  }, [dark]);

  return (
    <nav style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 20px", background: "var(--bg-secondary)",
      borderBottom: "0.5px solid var(--border)", position: "sticky", top: 0, zIndex: 100,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          <path d="M2 12h20"/>
        </svg>
        <span style={{ fontSize: 17, fontWeight: 600, color: "var(--text-primary)" }}>LiveSport</span>
        <span style={{
          background: "var(--accent)", color: "#fff", fontSize: 10, fontWeight: 600,
          padding: "2px 8px", borderRadius: 20, letterSpacing: 1,
        }}>LIVE</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={() => setDark(!dark)}
          style={{
            background: "var(--bg-card)", border: "0.5px solid var(--border)",
            color: "var(--text-primary)", padding: "6px 14px", borderRadius: 20,
            fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
          }}
        >
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
    </nav>
  );
}
