"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { useAuth } from "@/components/AuthProvider";
import { useToastStore } from "@/lib/stores/toast-store";
import { WishlistButton } from "@/components/WishlistButton";
import { SizeChart } from "@/components/SizeChart";
import { ImageLightbox } from "@/components/ImageLightbox";
import { STORE } from "@/lib/constants";
import type { Product } from "@/types";

type Review = {
  id: string;
  author_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

const COLORS_MAP: Record<string, string> = {
  Negro: "#0A0A0A", Blanco: "#F5F5F0", Rojo: "#FF3C2F",
  Azul: "#2563EB", Gris: "#888", Beige: "#E8DCC8",
  Verde: "#2D6A4F", Cafe: "#8B6914",
};

export default function ProductContent({ product: initialProduct, slug }: { product: Product | null; slug: string }) {
  const { addItem, items } = useCart();
  const { user } = useAuth();
  const addToast = useToastStore((s) => s.addToast);
  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [loading, setLoading] = useState(!initialProduct);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (initialProduct) return;
    async function load() {
      try {
        const res = await fetch(`/api/products?slug=${slug}&limit=1`);
        if (res.ok) {
          const data = await res.json();
          if (data.products?.[0]) setProduct(data.products[0]);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug, initialProduct]);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    if (!product) return;
    fetch(`/api/reviews/${product.id}`)
      .then((r) => r.json())
      .then((data) => setReviews(data.reviews || []))
      .catch(() => {});
  }, [product]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !reviewName.trim()) return;
    setReviewLoading(true);
    try {
      const res = await fetch(`/api/reviews/${product.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author_name: reviewName.trim(),
          rating: reviewRating,
          comment: reviewComment.trim() || null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setReviews((prev) => [data.review, ...prev]);
        setReviewFormOpen(false);
        setReviewComment("");
      }
    } catch {} finally {
      setReviewLoading(false);
    }
  };

  useEffect(() => {
    if (addedFeedback) {
      const t = setTimeout(() => setAddedFeedback(false), 2000);
      return () => clearTimeout(t);
    }
  }, [addedFeedback]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    const v = product.variants[selectedVariant];
    if (!v) return;
    addItem(product, v, qty);
    setQty(1);
    setAddedFeedback(true);
    if (!user) {
      addToast("Inicia sesion o crea una cuenta para guardar tu carrito", "info");
    }
  }, [product, selectedVariant, qty, addItem, user, addToast]);

  if (loading) {
    return (
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="aspect-[4/5] bg-smoke border border-border/50 rounded-sm animate-pulse" />
            <div className="space-y-4">
              <div className="h-5 w-20 bg-smoke border border-border/50 rounded-sm animate-pulse" />
              <div className="h-12 w-3/4 bg-smoke border border-border/50 rounded-sm animate-pulse" />
              <div className="h-8 w-28 bg-smoke border border-border/50 rounded-sm animate-pulse" />
              <div className="h-20 w-full bg-smoke border border-border/50 rounded-sm animate-pulse" />
              <div className="h-12 w-full bg-smoke border border-border/50 rounded-sm animate-pulse mt-8" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-[1400px] mx-auto text-center py-24">
          <span className="font-display text-8xl text-gold/10">404</span>
          <p className="mt-4 text-offwhite/40 font-body">Producto no encontrado</p>
          <Link href="/tienda" className="mt-6 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[2px] text-gold hover:text-gold-light transition-colors">
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  const variant = product.variants?.[selectedVariant];
  if (!variant) {
    return (
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-[1400px] mx-auto text-center py-24">
          <p className="text-offwhite/40 font-body">Error: producto sin variantes</p>
          <Link href="/tienda" className="mt-6 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[2px] text-gold hover:text-gold-light transition-colors">
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  const inCart = items.find((i) => i.variant.id === variant?.id);
  const uniqueColors = [...new Set(product.variants.map((v) => v.color))];
  const currentColor = variant?.color || uniqueColors[0];
  const sizesForColor = product.variants.filter((v) => v.color === currentColor);
  const stock = variant?.stock ?? 0;
  const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);

  const whatsappLink = "https://wa.me/" + STORE.whatsapp + "?text=" + encodeURIComponent(
    "Hola! Me interesa:\n\n*" + product.name + "*\nTalla: " + (variant?.size || "") + "\nColor: " + (variant?.color || "") + "\nPrecio: $" + product.price.toFixed(2) + "\n\nEsta disponible?"
  );

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2.5 text-[10px] font-mono text-offwhite/25 mb-10 flex-wrap">
          <Link href="/" className="hover:text-offwhite/50 transition-colors">Inicio</Link>
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
          <Link href="/tienda" className="hover:text-offwhite/50 transition-colors">Tienda</Link>
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
          <span className="text-offwhite/50 truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          <div>
            <div
              className="aspect-[4/5] bg-surface border border-border/50 overflow-hidden relative group cursor-zoom-in"
              onClick={() => setLightboxOpen(true)}
            >
              {product.images[selectedImage] ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-display text-8xl text-neon/10">NS</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-neon/[0.02] to-transparent pointer-events-none" />

              {totalStock <= 0 && (
                <div className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-ink/80 border border-neon/20 text-neon text-[9px] font-mono uppercase tracking-[1px] rounded-sm flex items-center gap-1.5">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  Agotado
                </div>
              )}
              {stock > 0 && stock <= 3 && (
                <div className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-ink/80 border border-yellow-500/20 text-yellow-400 text-[9px] font-mono uppercase tracking-[1px] rounded-sm">
                  Últimas {stock}
                </div>
              )}

              <div className="absolute top-4 right-4 z-10">
                <WishlistButton
                  product={{
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: product.price,
                    image: product.images[0] || "",
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-all"
                />
              </div>
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 overflow-hidden border transition-all duration-200 ${
                      selectedImage === i
                        ? "border-gold"
                        : "border-border/40 hover:border-offwhite/30"
                    }`}
                  >
                    <div className="relative w-full h-full">
                      <Image src={img} alt={`${product.name} vista ${i + 1}`} fill className="object-cover" sizes="80px" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-[2.5px] text-gold/60">
              {product.category?.name || "Producto"}
            </span>
            <h1 className="mt-3 font-display text-4xl md:text-6xl text-offwhite tracking-[1px] leading-none">
              {product.name}
            </h1>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-3xl md:text-4xl text-gold tracking-[1px]">
                ${product.price.toFixed(2)}
              </span>
              {product.variants.some((v) => v.stock > 0) && (
                <span className="text-[9px] font-mono uppercase tracking-[2px] text-offwhite/20">
                  IVA incluido
                </span>
              )}
            </div>

            <div className="mt-6 h-px bg-border/30" />
            <p className="mt-6 text-sm text-offwhite/45 font-body leading-relaxed whitespace-pre-line">
              {product.description || "Descripcion proximamente."}
            </p>

            {uniqueColors.length > 1 && (
              <div className="mt-8">
                <h3 className="text-[10px] font-mono uppercase tracking-[2px] text-gold/60 mb-3 flex items-center gap-2">
                  Color
                  <span className="text-offwhite/40 text-[10px] tracking-normal normal-case font-body">
                    {currentColor}
                  </span>
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {uniqueColors.map((color) => {
                    const isActive = currentColor === color;
                    return (
                      <button
                        key={color}
                        onClick={() => {
                          const idx = product.variants.findIndex((v) => v.color === color);
                          if (idx >= 0) setSelectedVariant(idx);
                        }}
                        className={`w-[34px] h-[34px] rounded-full cursor-pointer transition-all duration-200 border-2 ${
                          isActive ? "border-neon scale-110" : "border-transparent hover:scale-105"
                        }`}
                        style={{ backgroundColor: COLORS_MAP[color] || "#888" }}
                        title={color}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {sizesForColor.length > 1 && (
              <div className="mt-6">
                <h3 className="text-[10px] font-mono uppercase tracking-[2px] text-gold/60 mb-3 flex items-center gap-2">
                  Talla
                  <span className="text-offwhite/40 text-[10px] tracking-normal normal-case font-body">
                    {variant?.size || "Seleccionar"}
                  </span>
                  <SizeChart categorySlug={product.category?.slug} />
                </h3>
                <div className="flex flex-wrap gap-2">
                  {sizesForColor.map((v) => {
                    const globalIdx = product.variants.indexOf(v);
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(globalIdx)}
                        disabled={v.stock <= 0}
                        className={`w-10 h-10 flex items-center justify-center text-[11px] font-mono uppercase tracking-[1px] rounded-sm border transition-all duration-200 ${
                          selectedVariant === globalIdx
                            ? "bg-neon text-ink border-neon"
                            : "bg-transparent text-stone/60 border-border hover:text-paper/70 hover:border-stone/40"
                        } disabled:opacity-20 disabled:cursor-not-allowed`}
                      >
                        {v.size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center gap-3">
              {stock > 0 ? (
                <>
                  <div className="flex items-center border border-border/40 rounded-sm">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center text-offwhite/40 hover:text-offwhite hover:bg-gold/5 transition-all">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    </button>
                    <span className="w-10 text-center text-sm font-mono text-offwhite/80 tabular-nums">{qty}</span>
                    <button onClick={() => setQty(Math.min(stock, qty + 1))} className="w-10 h-10 flex items-center justify-center text-offwhite/40 hover:text-offwhite hover:bg-gold/5 transition-all">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    </button>
                  </div>
                  <button onClick={handleAddToCart} className="flex-1 py-3.5 bg-neon text-ink font-display text-base tracking-[2px] text-center rounded-sm hover:bg-neon-dim transition-all duration-300 active:scale-[0.98] relative overflow-hidden group">
                    <span className={`transition-all duration-300 flex items-center justify-center gap-2 ${addedFeedback ? "opacity-0 scale-75" : "opacity-100 scale-100"}`}>
                      {inCart ? "Agregar otro" : "Agregar al carrito"}
                      <span className="w-7 h-7 rounded-full bg-black/10 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </span>
                    </span>
                    <span className={`absolute inset-0 flex items-center justify-center gap-2 transition-all duration-300 ${addedFeedback ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Agregado!
                    </span>
                  </button>
                </>
              ) : (
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full py-3.5 border border-gold/30 text-gold font-display text-base tracking-[2px] text-center rounded-sm hover:bg-gold/10 transition-all duration-300 flex items-center justify-center gap-2 group">
                  Consultar disponibilidad
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                    <path d="M7 17L17 7" /><polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
              )}
            </div>

            {inCart && (
              <p className="mt-3 text-[10px] font-mono text-offwhite/25 text-center">
                {inCart.quantity} en tu carrito
              </p>
            )}

            <div className="mt-10 pt-8 border-t border-border/30 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold/40 mt-0.5 flex-shrink-0">
                  <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[1.5px] text-offwhite/50">Envios</p>
                  <p className="text-xs text-offwhite/30 font-body mt-0.5">A todo Venezuela</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold/40 mt-0.5 flex-shrink-0">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[1.5px] text-offwhite/50">Pick-up</p>
                  <p className="text-xs text-offwhite/30 font-body mt-0.5">En tienda (Maracay)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold/40 mt-0.5 flex-shrink-0">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[1.5px] text-offwhite/50">Cambios</p>
                  <p className="text-xs text-offwhite/30 font-body mt-0.5">Hasta 7 dias</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-12 border-t border-border/20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display text-2xl md:text-3xl text-offwhite tracking-[1px]">Resenas</h2>
              {(product.review_count ?? 0) > 0 && (
                <p className="text-xs font-mono text-offwhite/25 mt-2 flex items-center gap-2">
                  <span>{product.review_count} {product.review_count === 1 ? "opinion" : "opiniones"}</span>
                  <span className="text-offwhite/10">·</span>
                  <span className="flex items-center gap-1">
                    {product.avg_rating ?? 0}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-gold/60"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  </span>
                </p>
              )}
            </div>
            <button onClick={() => setReviewFormOpen(!reviewFormOpen)} className="text-[10px] font-mono uppercase tracking-[2px] px-5 py-2.5 border border-gold/25 text-gold/80 rounded-sm hover:bg-gold/10 hover:text-gold transition-all flex items-center gap-2">
              {reviewFormOpen ? (<>Cancelar</>) : (
                <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>Escribir resena</>
              )}
            </button>
          </div>

          {reviewFormOpen && (
            <form onSubmit={submitReview} className="mb-10 p-6 bg-surface/60 border border-border/20 rounded-sm space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[1.5px] text-offwhite/30 mb-1.5">Tu nombre</label>
                  <input type="text" value={reviewName} onChange={(e) => setReviewName(e.target.value)} placeholder="Nombre" className="w-full px-3 py-2.5 bg-surface/80 border border-border/30 rounded-sm text-sm text-offwhite/70 placeholder:text-offwhite/15 focus:border-gold/40 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[1.5px] text-offwhite/30 mb-1.5">Puntaje</label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setReviewRating(star)} className={`w-9 h-9 flex items-center justify-center rounded-sm transition-all ${star <= reviewRating ? "text-gold scale-110" : "text-offwhite/15 hover:text-offwhite/30"}`}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill={star <= reviewRating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      </button>
                    ))}
                    </div>
                  </div>
                </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-[1.5px] text-offwhite/30 mb-1.5">Comentario <span className="text-offwhite/15 normal-case tracking-normal font-body">(opcional)</span></label>
                <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder="Que tal el producto?" rows={2} className="w-full px-3 py-2.5 bg-surface/80 border border-border/30 rounded-sm text-sm text-offwhite/70 placeholder:text-offwhite/15 focus:border-gold/40 focus:outline-none transition-colors resize-none" />
              </div>
              <button type="submit" disabled={reviewLoading || !reviewName.trim()} className="px-6 py-2.5 bg-gold text-black font-display text-sm tracking-[2px] rounded-sm hover:bg-gold-light disabled:opacity-40 transition-all">
                {reviewLoading ? "Enviando..." : "Publicar resena"}
              </button>
            </form>
          )}

          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto text-offwhite/10 mb-4">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <p className="text-sm text-offwhite/25 font-body">No hay resenas aun. Se el primero en opinar.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-smoke border border-border/60 p-5 rounded-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-body text-offwhite/70">{review.author_name}</span>
                    <span className="text-[10px] text-offwhite/20 font-mono">{new Date(review.created_at).toLocaleDateString("es-ES")}</span>
                  </div>
                  <div className="flex gap-0.5 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={`${star <= review.rating ? "text-gold" : "text-offwhite/8"}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill={star <= review.rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      </span>
                    ))}
                  </div>
                  {review.comment && <p className="text-xs text-offwhite/40 leading-relaxed font-body">{review.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {lightboxOpen && product?.images && (
        <ImageLightbox
          images={product.images}
          initialIndex={selectedImage}
          productName={product.name}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
