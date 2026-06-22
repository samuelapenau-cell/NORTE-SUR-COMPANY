import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
let lastCleanup = Date.now();

export function rateLimit(key: string, maxRequests = 30, windowMs = 60000): boolean {
  const now = Date.now();

  if (now - lastCleanup > 60000) {
    for (const [k, v] of rateLimitMap) {
      if (now > v.resetAt) rateLimitMap.delete(k);
    }
    lastCleanup = now;
  }

  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= maxRequests) return false;
  entry.count++;
  return true;
}

export function addCacheHeaders(response: NextResponse, maxAge = 60): NextResponse {
  response.headers.set("Cache-Control", `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 2}`);
  return response;
}

export async function isAdminUser(supabase: any, user: any): Promise<boolean> {
  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()) || [];
  if (adminEmails.includes(user.email?.toLowerCase() || "")) return true;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role === "admin";
}

export async function requireAdmin(): Promise<{ user: any; errorResponse?: NextResponse }> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { user: null, errorResponse: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  if (await isAdminUser(supabase, user)) {
    return { user };
  }

  return { user: null, errorResponse: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
}
