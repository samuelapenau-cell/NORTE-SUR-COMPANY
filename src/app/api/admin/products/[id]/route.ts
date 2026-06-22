import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { productSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/api-utils";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const { id } = await params;
  const body = await request.json();
  const parsed = productSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();
  const { name, slug, description, price, category_id, images, featured, active, variants } = parsed.data;

  const updateData: Record<string, any> = {};
  if (name !== undefined) updateData.name = name;
  if (slug !== undefined) updateData.slug = slug;
  if (description !== undefined) updateData.description = description;
  if (price !== undefined) updateData.price = price;
  if (category_id !== undefined) updateData.category_id = category_id;
  if (images !== undefined) updateData.images = images;
  if (featured !== undefined) updateData.featured = featured;
  if (active !== undefined) updateData.active = active;

  if (Object.keys(updateData).length > 0) {
    const { error: productError } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", id);

    if (productError) return NextResponse.json({ error: productError.message }, { status: 500 });
  }

  if (variants) {
    const { error: deleteError } = await supabase
      .from("product_variants")
      .delete()
      .eq("product_id", id);

    if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });

    const variantRows = variants.map((v) => ({
      product_id: id,
      size: v.size,
      color: v.color,
      stock: v.stock,
      sku: v.sku || `${slug || id}-${v.size}-${v.color}`.toUpperCase().replace(/\s+/g, "-"),
    }));

    if (variantRows.length > 0) {
      const { error: insertError } = await supabase
        .from("product_variants")
        .insert(variantRows);

      if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
