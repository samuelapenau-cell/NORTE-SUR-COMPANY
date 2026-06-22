import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { variantIds } = await request.json();
  if (!Array.isArray(variantIds) || variantIds.length === 0) {
    return NextResponse.json({ error: "variantIds required" }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();
  const { data: variants, error } = await supabase
    .from("product_variants")
    .select("id, stock, size, color, product:products(id, name, slug)")
    .in("id", variantIds);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const stockMap: Record<string, { stock: number; available: boolean }> = {};
  for (const v of variants || []) {
    stockMap[v.id] = { stock: v.stock, available: v.stock > 0 };
  }

  return NextResponse.json({ stock: stockMap });
}
