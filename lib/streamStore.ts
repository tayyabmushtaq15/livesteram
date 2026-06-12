import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "stream-data.json");

export type StreamData = {
  youtubeUrl: string;
  title: string;
  team1: string;
  team2: string;
  score1: number;
  score2: number;
  minute: number;
  isLive: boolean;
};

const DEFAULT: StreamData = {
  youtubeUrl: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
  title: "FIFA World Cup Final",
  team1: "Argentina 🇦🇷",
  team2: "France 🇫🇷",
  score1: 2,
  score2: 1,
  minute: 74,
  isLive: true,
};

export function readStreamData(): StreamData {
  try {
    if (!fs.existsSync(DATA_FILE)) return DEFAULT;
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT;
  }
}

export function writeStreamData(data: Partial<StreamData>): StreamData {
  const current = readStreamData();
  const updated = { ...current, ...data };
  fs.writeFileSync(DATA_FILE, JSON.stringify(updated, null, 2));
  return updated;
}
