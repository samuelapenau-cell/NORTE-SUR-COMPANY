import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug") || "slim-fit-unicolor-carpediem-blanco";

  const messages: string[] = [];
  let step = 0;

  try {
    step = 1;
    messages.push("[1] createServerSupabaseClient...");
    const supabase = await createServerSupabaseClient();
    messages.push("[1] OK");

    step = 2;
    messages.push("[2] Query products...");
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*), variants:product_variants(*)")
      .eq("slug", slug)
      .eq("active", true)
      .limit(1)
      .maybeSingle();

    if (error) {
      messages.push(`[2] Supabase error: ${error.message} (${error.code})`);
    } else if (data) {
      messages.push(`[2] Product found: ${data.name}`);
      messages.push(`[2] Variants: ${data.variants?.length ?? 0}`);
      messages.push(`[2] Category: ${data.category?.name ?? "none"}`);
    } else {
      messages.push("[2] No product found (maybeSingle returned null)");
    }

    step = 3;
    messages.push("[3] JSON-LD construction...");
    const jsonLd = data ? {
      "@context": "https://schema.org",
      "@type": "Product",
      name: data.name,
      offers: { "@type": "Offer", price: Number(data.price), priceCurrency: "USD" },
    } : null;
    messages.push(`[3] jsonLd: ${jsonLd ? "ok" : "null"}`);

    return NextResponse.json({ success: true, slug, messages, hasProduct: !!data });
  } catch (e: any) {
    messages.push(`[ERROR at step ${step}]: ${e?.message || e}`);
    return NextResponse.json({ success: false, slug, messages }, { status: 200 });
  }
}
