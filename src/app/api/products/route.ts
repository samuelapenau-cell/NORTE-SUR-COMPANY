import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { rateLimit, addCacheHeaders } from "@/lib/api-utils";

export async function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "anonymous";
  if (!rateLimit(`products:${ip}`, 60, 60000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const featured = searchParams.get("featured");
  const slug = searchParams.get("slug");
  const search = searchParams.get("search");
  const limit = parseInt(searchParams.get("limit") || "20");
  const supabase = await createServerSupabaseClient();

  if (search && search.trim().length > 0) {
    const { data: products, error } = await supabase
      .rpc("search_products", { search_query: search.trim(), max_results: limit })
      .select("*, category:categories(*), variants:product_variants(*)");

    if (error) return NextResponse.json({ products: [] });
    return addCacheHeaders(NextResponse.json({ products }), 30);
  }

  let query = supabase
    .from("products")
    .select("*, category:categories(*), variants:product_variants(*)");

  if (featured === "true") {
    query = query.eq("featured", true);
  }

  if (slug) {
    query = query.eq("slug", slug);
  }

  const { data: products, error } = await query
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(slug ? 1 : limit);

  if (error) {
    return NextResponse.json({ products: [] });
  }

  return addCacheHeaders(NextResponse.json({ products }), 60);
}
