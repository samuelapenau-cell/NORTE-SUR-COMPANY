import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ reviews: reviews || [] });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const body = await request.json();
  const { author_name, rating, comment } = body;

  if (!author_name || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Name and rating (1-5) required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      product_id: productId,
      user_id: user?.id || null,
      author_name,
      rating,
      comment: comment || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: agg } = await supabase
    .from("reviews")
    .select("rating")
    .eq("product_id", productId);

  if (agg && agg.length > 0) {
    const avg = agg.reduce((s, r) => s + r.rating, 0) / agg.length;
    await supabase
      .from("products")
      .update({ avg_rating: Math.round(avg * 10) / 10, review_count: agg.length })
      .eq("id", productId);
  }

  return NextResponse.json({ review: data }, { status: 201 });
}
