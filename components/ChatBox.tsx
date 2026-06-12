"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase, ChatMessage } from "@/lib/supabase";

const AVATAR_COLORS = ["#7f77dd","#1d9e75","#d85a30","#e24b4a","#534ab7","#0f6e56","#c0922a","#2a7fb5"];

function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// Persistent guest name per browser session
function getGuestName(): string {
  if (typeof window === "undefined") return "Guest";
  const stored = sessionStorage.getItem("livesport_username");
  if (stored) return stored;
  const name = "Guest" + Math.floor(Math.random() * 9000 + 1000);
  sessionStorage.setItem("livesport_username", name);
  return name;
}

export default function ChatBox() {
  const [messages, setMessages]     = useState<ChatMessage[]>([]);
  const [text, setText]             = useState("");
  const [sending, setSending]       = useState(false);
  const [online, setOnline]         = useState(0);
  const [username, setUsername]     = useState("Guest");
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput]   = useState("");
  const [connected, setConnected]   = useState(false);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  // Load initial messages
  const loadMessages = useCallback(async () => {
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) setMessages(data.reverse());
  }, []);

  useEffect(() => {
    const name = getGuestName();
    setUsername(name);
    setNameInput(name);
    loadMessages();
  }, [loadMessages]);

  // Supabase Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("chat_messages_realtime", {
        config: { presence: { key: username } },
      })
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "chat_messages",
      }, (payload) => {
        setMessages((prev) => {
          // avoid duplicates
          if (prev.find((m) => m.id === payload.new.id)) return prev;
          return [...prev, payload.new as ChatMessage];
        });
      })
      // Track online users via Presence
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        setOnline(Object.keys(state).length);
      })
      .on("presence", { event: "join" }, () => {
        const state = channel.presenceState();
        setOnline(Object.keys(state).length);
      })
      .on("presence", { event: "leave" }, () => {
        const state = channel.presenceState();
        setOnline(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          setConnected(true);
          await channel.track({ username, online_at: new Date().toISOString() });
        } else {
          setConnected(false);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [username]);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMsg() {
    if (!text.trim() || sending) return;
    const msgText = text.trim();
    setText("");
    setSending(true);
    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: username, text: msgText }),
      });
    } catch {}
    setSending(false);
    inputRef.current?.focus();
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMsg();
    }
  }

  function saveName() {
    const trimmed = nameInput.trim().substring(0, 20);
    if (!trimmed) return;
    setUsername(trimmed);
    sessionStorage.setItem("livesport_username", trimmed);
    setEditingName(false);
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%",
      background: "var(--bg-card)", border: "0.5px solid var(--border)",
      borderRadius: 10, overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "10px 14px", borderBottom: "0.5px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Live Chat</span>
          <span style={{
            background: connected ? "#1d9e7522" : "#e24b4a22",
            color: connected ? "#1d9e75" : "var(--accent)",
            fontSize: 11, padding: "2px 8px", borderRadius: 20,
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: "50%",
              background: connected ? "#1d9e75" : "var(--accent)",
              display: "inline-block",
              animation: connected ? "pulse 2s infinite" : "none",
            }}/>
            {connected ? `${online > 0 ? online : "—"} online` : "connecting..."}
          </span>
        </div>

        {/* Username editor */}
        {editingName ? (
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveName()}
              maxLength={20}
              autoFocus
              style={{
                background: "var(--bg-secondary)", border: "0.5px solid var(--border)",
                borderRadius: 6, color: "var(--text-primary)", fontSize: 12,
                padding: "3px 8px", outline: "none", width: 100,
              }}
            />
            <button onClick={saveName} style={{
              background: "var(--accent)", border: "none", borderRadius: 5,
              color: "#fff", fontSize: 11, padding: "3px 8px", cursor: "pointer",
            }}>Save</button>
          </div>
        ) : (
          <button onClick={() => setEditingName(true)} style={{
            background: "var(--bg-secondary)", border: "0.5px solid var(--border)",
            borderRadius: 6, color: "var(--text-secondary)", fontSize: 11,
            padding: "3px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
          }}>
            ✏️ {username}
          </button>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: 13, marginTop: 40 }}>
            No comments to show — be the first to comment! 💬
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: avatarColor(msg.username),
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 700, color: "#fff", flexShrink: 0,
            }}>
              {msg.avatar}
            </div>
            <div style={{ maxWidth: "80%" }}>
              <div style={{ display: "flex", gap: 6, alignItems: "baseline", marginBottom: 2 }}>
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  color: msg.username === username ? "var(--accent)" : "var(--text-secondary)",
                }}>
                  {msg.username === username ? "You" : msg.username}
                </span>
                <span style={{ fontSize: 10, color: "var(--text-secondary)", opacity: 0.5 }}>
                  {formatTime(msg.created_at)}
                </span>
              </div>
              <div style={{
                background: msg.username === username ? "var(--accent)18" : "var(--bg-secondary)",
                border: msg.username === username ? "0.5px solid var(--accent)44" : "0.5px solid var(--border)",
                borderRadius: 8, padding: "6px 10px", fontSize: 13,
                color: "var(--text-primary)", lineHeight: 1.5, wordBreak: "break-word",
              }}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: "10px 12px", borderTop: "0.5px solid var(--border)",
        display: "flex", gap: 8,
      }}>
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder={connected ? "Type your message..." : "Connecting..."}
          disabled={!connected}
          maxLength={200}
          style={{
            flex: 1, background: "var(--bg-secondary)",
            border: "0.5px solid var(--border)", borderRadius: 8,
            color: "var(--text-primary)", fontSize: 13,
            padding: "8px 12px", outline: "none",
            opacity: connected ? 1 : 0.5,
          }}
        />
        <button
          onClick={sendMsg}
          disabled={sending || !text.trim() || !connected}
          style={{
            background: (sending || !text.trim() || !connected) ? "var(--bg-secondary)" : "var(--accent)",
            border: "0.5px solid var(--border)", borderRadius: 8,
            color: "#fff", padding: "8px 14px", fontSize: 16,
            cursor: "pointer", transition: "background 0.2s", lineHeight: 1,
          }}
        >
          ➤
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
}
