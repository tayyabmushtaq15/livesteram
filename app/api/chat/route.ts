import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data || []).reverse());
}

export async function POST(req: NextRequest) {
  try {
    const { user, text } = await req.json();
    if (!user || !text || text.trim().length === 0)
      return NextResponse.json({ error: "user and text required" }, { status: 400 });
    if (text.length > 200)
      return NextResponse.json({ error: "Message too long" }, { status: 400 });

    const avatar = user.trim().substring(0, 2).toUpperCase();

    const { data, error } = await supabase
      .from("chat_messages")
      .insert({ username: user.trim().substring(0, 20), text: text.trim(), avatar })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
