"use client";

import { useWishlist } from "@/lib/stores/wishlist-store";

interface WishlistButtonProps {
  product: { id: string; name: string; slug: string; price: number; image: string };
  className?: string;
  iconOnly?: boolean;
}

export function WishlistButton({ product, className = "", iconOnly }: WishlistButtonProps) {
  const { toggleItem, isWishlisted } = useWishlist();
  const active = isWishlisted(product.id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleItem(product);
      }}
      className={className || `absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
        active
          ? "bg-accent/20 text-accent"
          : "bg-black/40 text-offwhite/50 hover:text-offwhite hover:bg-black/60"
      }`}
      aria-label={active ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    </button>
  );
}
