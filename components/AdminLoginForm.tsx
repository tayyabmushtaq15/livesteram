"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin");
        return;
      }

      const data = await res.json();
      setError(data.error || "Login failed.");
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <main style={{ maxWidth: 440, margin: "0 auto", padding: "72px 16px" }}>
        <div style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)", borderRadius: 16, padding: "32px" }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 12, color: "var(--text-primary)" }}>
            Admin Login
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>
            Enter the admin password to access the protected dashboard.
          </p>

          <form onSubmit={handleLogin}>
            <label style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                background: "var(--bg-secondary)",
                border: "0.5px solid var(--border)",
                borderRadius: 8,
                color: "var(--text-primary)",
                padding: "12px 14px",
                fontSize: 14,
                marginTop: 8,
                marginBottom: 16,
                outline: "none",
              }}
              placeholder="Enter admin password"
            />

            {error && (
              <div style={{ color: "#e24b4a", marginBottom: 16, fontSize: 13 }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: "var(--accent)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "14px",
                fontSize: 15,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 18 }}>
            This admin login uses a secure, HttpOnly session cookie. Passwords stay on the server.
          </p>
        </div>
      </main>
    </div>
  );
}
