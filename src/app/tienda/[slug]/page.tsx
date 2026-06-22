import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import ProductContent from "./ProductContent";
import type { Product } from "@/types";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const supabase = await createServerSupabaseClient();
    const { data: products } = await supabase
      .from("products")
      .select("name, description, images")
      .eq("slug", slug)
      .maybeSingle();
    if (products) {
      return {
        title: `${products.name} | NORTE SUR Tienda`,
        description: products.description?.slice(0, 160) || `${products.name} en NORTE SUR.`,
        openGraph: {
          title: `${products.name} | NORTE SUR`,
          description: products.description?.slice(0, 160),
          images: products.images?.[0] ? [{ url: products.images[0] }] : [],
        },
      };
    }
  } catch {}
  return {
    title: "Producto | NORTE SUR Tienda",
    description: "Explora nuestros productos streetwear en Maracay.",
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  let products: Product | null = null;
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("products")
      .select("*, category:categories(*), variants:product_variants(*)")
      .eq("slug", slug)
      .eq("active", true)
      .limit(1)
      .maybeSingle();
    products = data;
  } catch {
    products = null;
  }

  const jsonLd = products ? {
    "@context": "https://schema.org",
    "@type": "Product",
    name: products.name,
    description: products.description?.slice(0, 200),
    image: products.images?.[0] || undefined,
    offers: {
      "@type": "Offer",
      price: Number(products.price),
      priceCurrency: "USD",
      availability: products.variants?.some((v: any) => v.stock > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductContent product={products} slug={slug} />
    </>
  );
}
