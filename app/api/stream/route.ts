import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const DEFAULT_CONFIG = {
  youtubeUrl: "",
  matchTitle: "Streamio",
  team1: "Team 1",
  team2: "Team 2",
  score1: 0,
  score2: 0,
  minute: 0,
  isLive: false,
  tournament: "Stream Tournament",
};

export async function GET() {
  const { data, error } = await supabase
    .from("stream_config")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !data) {
    // Table empty hai — default return karo
    return NextResponse.json(DEFAULT_CONFIG);
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { adminKey, ...updates } = body;

    if (adminKey !== (process.env.ADMIN_KEY || "admin123")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Upsert — agar row hai update karo, nahi hai toh insert karo
    const { data, error } = await supabase
      .from("stream_config")
      .upsert({ id: 1, ...updates }, { onConflict: "id" })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, config: data });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
