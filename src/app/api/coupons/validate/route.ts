import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { code, total } = await request.json();

  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Coupon code required" }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();
  const { data: coupon, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code.toUpperCase())
    .single();

  if (error || !coupon) {
    return NextResponse.json({ error: "Cupón inválido" }, { status: 404 });
  }

  if (!coupon.active) {
    return NextResponse.json({ error: "Este cupón ya no está activo" }, { status: 400 });
  }

  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return NextResponse.json({ error: "Este cupón ha expirado" }, { status: 400 });
  }

  if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
    return NextResponse.json({ error: "Este cupón ha alcanzado su límite de usos" }, { status: 400 });
  }

  if (total < coupon.min_purchase) {
    return NextResponse.json({
      error: `Compra mínima de $${coupon.min_purchase.toFixed(2)} para usar este cupón`,
    }, { status: 400 });
  }

  let discount = 0;
  if (coupon.discount_type === "percentage") {
    discount = total * (coupon.discount_value / 100);
  } else {
    discount = Math.min(coupon.discount_value, total);
  }

  const { error: updateError } = await supabase
    .rpc("increment_coupon_usage", { coupon_id: coupon.id });

  if (updateError) console.error("Failed to increment coupon usage:", updateError);

  return NextResponse.json({
    valid: true,
    coupon: {
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      discount,
      total_after_discount: total - discount,
    },
  });
}
