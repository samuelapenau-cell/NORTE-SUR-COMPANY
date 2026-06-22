import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase());

export async function POST(request: Request) {
  const adminEmails = ADMIN_EMAILS;
  if (adminEmails.length === 0) {
    return NextResponse.json({ error: "No admin emails configured" }, { status: 500 });
  }

  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!adminEmails.includes(normalizedEmail)) {
    return NextResponse.json({ error: "Email not authorized as admin" }, { status: 403 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase.auth.admin.createUser({
    email: normalizedEmail,
    password,
    email_confirm: true,
  });

  if (error) {
    const status = error.message.toLowerCase().includes("already") ? 409 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }

  return NextResponse.json({ success: true, id: data.user.id });
}
