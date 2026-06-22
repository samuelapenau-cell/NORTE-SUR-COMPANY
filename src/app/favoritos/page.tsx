"use client";

import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/lib/stores/wishlist-store";
import { WishlistButton } from "@/components/WishlistButton";

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <div className="pt-24 pb-16 px-6 min-h-screen">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-gold"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
          <h1 className="font-display text-3xl text-offwhite tracking-[2px]">
            Mis <span className="text-gold">Favoritos</span>
          </h1>
          <span className="text-xs font-mono text-offwhite/30 ml-auto">
            {items.length} {items.length === 1 ? "producto" : "productos"}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-offwhite/40 font-body">No tienes favoritos aún</p>
            <Link
              href="/tienda"
              className="mt-4 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[2px] text-gold hover:text-gold-light transition-colors"
            >
              Explorar productos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/tienda/${item.slug}`}
                className="group block"
              >
                <div className="aspect-[3/4] bg-surface-light border border-border rounded-sm overflow-hidden relative">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-display text-6xl text-gold/10">MR</span>
                    </div>
                  )}
                  <WishlistButton
                    product={item}
                    className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-all"
                  />
                </div>
                <div className="mt-3 px-1">
                  <h3 className="text-sm font-body text-offwhite group-hover:text-gold transition-colors truncate">
                    {item.name}
                  </h3>
                  <p className="text-gold font-display text-lg tracking-[1px] mt-0.5">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
