import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, key);

export interface ChatMessage {
  id: string;
  username: string;
  text: string;
  avatar: string;
  created_at: string;
}

export interface StreamConfig {
  id: number;
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
