import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { productSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/api-utils";

export async function GET() {
  const { user, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const supabase = await createServerSupabaseClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*, category:categories(*), variants:product_variants(*)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const { user, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const body = await request.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();
  const { name, slug, description, price, category_id, images, featured, variants } = parsed.data;

  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({ name, slug, description, price, category_id, images, featured, active: true })
    .select()
    .single();

  if (productError) return NextResponse.json({ error: productError.message }, { status: 500 });

  if (variants.length > 0) {
    const variantRows = variants.map((v) => ({
      product_id: product.id,
      size: v.size,
      color: v.color,
      stock: v.stock,
      sku: v.sku || `${slug}-${v.size}-${v.color}`.toUpperCase().replace(/\s+/g, "-"),
    }));

    const { error: variantError } = await supabase
      .from("product_variants")
      .insert(variantRows);

    if (variantError) return NextResponse.json({ error: variantError.message }, { status: 500 });
  }

  return NextResponse.json({ product });
}
