"use client";

import Link from "next/link";
import Image from "next/image";
import { WishlistButton } from "@/components/WishlistButton";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const isSoldOut = product.variants.length > 0 && product.variants.every((v) => v.stock <= 0);
  const lowStock = !isSoldOut && product.variants.some((v) => v.stock > 0 && v.stock <= 3);

  return (
    <Link
      href={`/tienda/${product.slug}`}
      className="group block"
      aria-label={`${product.name} — $${product.price.toFixed(2)}${isSoldOut ? " — Agotado" : ""}`}
    >
      <div className="relative bg-smoke border border-border/60 rounded-sm overflow-hidden">
        <div className="aspect-[3/4] relative flex items-center justify-center overflow-hidden">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={`${product.name} — ${product.category?.name || "Producto"} NORTE SUR`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-neon/15">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          )}

          {isSoldOut && (
            <span className="absolute top-3 left-3 z-10 px-2 py-1 bg-ink/80 border border-neon/20 text-neon text-[9px] font-mono uppercase tracking-[1px] rounded-sm">
              Agotado
            </span>
          )}
          {lowStock && !isSoldOut && (
            <span className="absolute top-3 left-3 z-10 px-2 py-1 bg-ink/80 border border-yellow-500/20 text-yellow-400 text-[9px] font-mono uppercase tracking-[1px] rounded-sm">
              Últimas
            </span>
          )}

          <div className="absolute top-3 right-3 z-10">
            <WishlistButton
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                image: product.images[0] || "",
              }}
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        <div className="p-3.5">
          {product.category?.name && (
            <span className="text-[8px] font-mono uppercase tracking-[2px] text-neon/50 block mb-1">
              {product.category.name}
            </span>
          )}
          <h3 className="text-sm font-body text-paper/80 group-hover:text-neon transition-colors truncate leading-tight">
            {product.name}
          </h3>
          <p className="font-display text-base text-paper tracking-[1px] mt-1.5">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </div>
    </Link>
  );
}
