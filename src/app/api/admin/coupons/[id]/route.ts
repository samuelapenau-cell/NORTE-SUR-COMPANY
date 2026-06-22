import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-utils";
import { couponSchema } from "@/lib/validations";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const supabase = await createServerSupabaseClient();
  const { data: coupon, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !coupon) {
    return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
  }

  return NextResponse.json({ coupon });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const body = await request.json();
  const parsed = couponSchema.partial().safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();

  const updates: Record<string, any> = {};
  if (parsed.data.code !== undefined) updates.code = parsed.data.code;
  if (parsed.data.discount_type !== undefined) updates.discount_type = parsed.data.discount_type;
  if (parsed.data.discount_value !== undefined) updates.discount_value = parsed.data.discount_value;
  if (parsed.data.min_purchase !== undefined) updates.min_purchase = parsed.data.min_purchase;
  if (parsed.data.max_uses !== undefined) updates.max_uses = parsed.data.max_uses;
  if (parsed.data.active !== undefined) updates.active = parsed.data.active;
  if (parsed.data.expires_at !== undefined) updates.expires_at = parsed.data.expires_at || null;

  const { data: coupon, error } = await supabase
    .from("coupons")
    .update(updates)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Ya existe un cupón con ese código" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
  }

  return NextResponse.json({ coupon });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("coupons").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
