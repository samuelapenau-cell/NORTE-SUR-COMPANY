import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { createOrderSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/api-utils";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "anonymous";
  if (!rateLimit(`create-order:${ip}`, 5, 60000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const body = await request.json();
  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { customer_name, customer_phone, customer_address, items } = parsed.data;

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const tracking_token = randomUUID();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user?.id || null,
      customer_name,
      customer_phone,
      customer_address,
      total,
      status: "pending",
      tracking_token,
    })
    .select()
    .single();

  if (orderError) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.product_name,
    variant_id: item.variant_id,
    variant_label: item.variant_label,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    await supabase.from("orders").delete().eq("id", order.id);
    return NextResponse.json({ error: "Failed to create order items" }, { status: 500 });
  }

  for (const item of items) {
    const { data: variant } = await supabase
      .from("product_variants")
      .select("stock")
      .eq("id", item.variant_id)
      .single();

    if (variant) {
      await supabase
        .from("product_variants")
        .update({ stock: Math.max(0, variant.stock - item.quantity) })
        .eq("id", item.variant_id);
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nortesur.vercel.app";
  const trackingUrl = `${siteUrl}/rastrear/${order.tracking_token}`;

  return NextResponse.json({ order, total, tracking_url: trackingUrl, tracking_token: order.tracking_token }, { status: 201 });
}
