import { createServerSupabaseClient } from "@/lib/supabase/server";
import { HomeClient } from "./HomeClient";
import type { Product, Category } from "@/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let featured: Product[] = [];
  let categories: Category[] = [];

  try {
    const supabase = await createServerSupabaseClient();

    const [featuredRes, categoriesRes] = await Promise.all([
      supabase
        .from("products")
        .select("*, category:categories(*), variants:product_variants(*)")
        .eq("featured", true)
        .eq("active", true)
        .order("created_at", { ascending: false })
        .limit(4),
      supabase
        .from("categories")
        .select("*")
        .order("name"),
    ]);

    if (featuredRes.data) featured = featuredRes.data as unknown as Product[];
    if (categoriesRes.data) categories = categoriesRes.data as unknown as Category[];
  } catch {
    // Server fetch failed — client will use mock data
  }

  return <HomeClient featured={featured} categories={categories} />;
}
