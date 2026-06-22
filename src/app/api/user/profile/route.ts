import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, phone, address")
    .eq("id", user.id)
    .single();

  return NextResponse.json({
    profile: {
      name: profile?.name || user.user_metadata?.full_name || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
    },
  });
}

export async function PUT(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { name, phone, address } = body;

  const updates: Record<string, string> = {};
  if (typeof name === "string") updates.name = name.trim();
  if (typeof phone === "string") updates.phone = phone.trim();
  if (typeof address === "string") updates.address = address.trim();

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const { error } = await supabase
    .from("profiles")
    .upsert({ id: user.id, ...updates }, { onConflict: "id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, profile: updates });
}
