// Simple in-memory store for stream config and chat
// In production, replace with a real database (MongoDB, Supabase, etc.)

export interface StreamConfig {
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

export interface ChatMessage {
  id: string;
  user: string;
  text: string;
  time: string;
  avatar: string;
}

// Default stream config
export const streamConfig: StreamConfig = {
  youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  matchTitle: "FIFA World Cup Final",
  team1: "Argentina 🇦🇷",
  team2: "France 🇫🇷",
  score1: 2,
  score2: 1,
  minute: 74,
  isLive: true,
  tournament: "FIFA World Cup 2026",
};

// In-memory chat messages
export const chatMessages: ChatMessage[] = [
  { id: "1", user: "Ahmed K", text: "Messi zabardast khel raha hai! 🔥", time: "74:12", avatar: "AK" },
  { id: "2", user: "Sara B", text: "Goal aane wala hai pakka!", time: "74:30", avatar: "SB" },
  { id: "3", user: "Zain R", text: "Yeh match toh classic ban gaya 🏆", time: "74:45", avatar: "ZR" },
  { id: "4", user: "M. Hassan", text: "France wapas aa sakti hai abhi", time: "75:00", avatar: "MH" },
];

let msgCounter = 5;
export function addMessage(user: string, text: string): ChatMessage {
  const msg: ChatMessage = {
    id: String(msgCounter++),
    user,
    text,
    time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    avatar: user.substring(0, 2).toUpperCase(),
  };
  chatMessages.push(msg);
  if (chatMessages.length > 100) chatMessages.shift();
  return msg;
}
