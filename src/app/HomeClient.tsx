"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { STORE } from "@/lib/constants";
import { SectionErrorBoundary } from "@/components/SectionErrorBoundary";
import { InstagramFeed } from "@/components/InstagramFeed";
import type { Product, Category } from "@/types";

const HERO_IMAGES = [
  "/portada/Screenshot_2026-06-22-11-43-26-511_com.instagram.android-edit.jpg.jpeg",
  "/portada/Screenshot_2026-06-22-11-43-54-361_com.instagram.android-edit.jpg.jpeg",
  "/portada/Screenshot_2026-06-22-11-44-48-390_com.instagram.android-edit.jpg.jpeg",
  "/portada/Screenshot_2026-06-22-11-45-24-706_com.instagram.android-edit.jpg.jpeg",
  "/portada/Screenshot_2026-06-22-11-46-22-137_com.instagram.android-edit.jpg.jpeg",
  "/portada/Screenshot_2026-06-22-11-47-21-600_com.instagram.android-edit.jpg.jpeg",
];

const PRODUCTS = [
  { name: "Franela Oversize Black", cat: "Franelas", price: 18.0, slug: "" },
  { name: "Hoodie Boxyfit Grey", cat: "Hoodies", price: 35.0, slug: "" },
  { name: "Jogger Oversize Beige", cat: "Joggers", price: 28.0, slug: "" },
  { name: "Gorra NS Edición", cat: "Gorras", price: 15.0, slug: "" },
  { name: "Franela Oversize White", cat: "Franelas", price: 18.0, slug: "" },
  { name: "Hoodie Boxyfit Black", cat: "Hoodies", price: 38.0, slug: "" },
  { name: "Jogger Oversize Black", cat: "Joggers", price: 28.0, slug: "" },
  { name: "Conjunto NS Crew", cat: "Conjuntos", price: 55.0, slug: "" },
];

const CATEGORIES_SLIM = [
  { name: "Franelas", slug: "franelas-oversize", count: "12" },
  { name: "Hoodies", slug: "hoodies", count: "8" },
  { name: "Joggers", slug: "joggers", count: "6" },
  { name: "Gorras", slug: "gorras", count: "5" },
  { name: "Accesorios", slug: "accesorios", count: "4" },
];

export function HomeClient({ featured, categories }: { featured: Product[]; categories: Category[] }) {
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[85dvh] flex items-center overflow-hidden pt-14">
        {/* Background Slideshow */}
        <div className="absolute inset-0">
          {HERO_IMAGES.map((src, i) => (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
                i === currentImg ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover object-[50%_25%] image-rendering-auto"
                sizes="100vw"
                priority={i === 0}
                quality={100}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/70 to-ink/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
          <div className="absolute inset-0 grain pointer-events-none" />
          <div className="absolute inset-0 glow-hero pointer-events-none" />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10">
          <p className="text-[10px] font-mono uppercase tracking-[3px] text-stone mb-4 animate-fade-in">
            Maracay, Venezuela — Est. 2023
          </p>
          <h1 className="font-display text-[clamp(3rem,12vw,9rem)] leading-[0.85] text-paper uppercase tracking-[-2px]">
            NORTE
            <br />
            <span className="text-neon">SUR</span>
          </h1>
          <div className="h-[1px] w-24 bg-neon mt-8 mb-6" />
          <p className="text-sm text-stone font-body max-w-[440px] leading-relaxed">
            Streetwear premium hecho en Venezuela. Franelas oversize, hoodies, joggers y más. 
            Distribuidores N°1 de oversize en Maracay.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link
              href="/tienda"
              className="inline-flex items-center gap-2 px-6 py-3 bg-neon text-ink text-xs font-mono uppercase tracking-[2px] hover:bg-neon-dim transition-colors duration-300"
            >
              Explorar tienda
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
            <a
              href={`https://wa.me/${STORE.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-gravel text-gravel hover:text-paper hover:border-paper text-xs font-mono uppercase tracking-[2px] transition-colors duration-300"
            >
              WhatsApp
            </a>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon/30 to-transparent" />
      </section>

      {/* ── CATEGORÍAS ── */}
      <section className="py-16 md:py-20 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[3px] text-stone">Categorías</span>
            </div>
            <Link href="/tienda" className="text-[10px] font-mono uppercase tracking-[2px] text-gravel hover:text-paper transition-colors">
              Ver todo →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {(categories.length > 0 ? categories : CATEGORIES_SLIM).map((c) => {
              const name = typeof c === "object" && "name" in c ? (c as Category).name : (c as typeof CATEGORIES_SLIM[0]).name;
              const slug = typeof c === "object" && "slug" in c ? (c as Category).slug || "" : (c as typeof CATEGORIES_SLIM[0]).slug;
              const count = typeof c === "object" && "name" in c ? "" : (c as typeof CATEGORIES_SLIM[0]).count;
              return (
                <Link
                  key={name}
                  href={`/tienda?categoria=${slug}`}
                  className="group relative p-5 md:p-6 bg-smoke border border-border hover:border-neon/40 transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-neon/[0.02] to-transparent group-hover:from-neon/[0.06] transition-all duration-500" />
                  <div className="relative z-10">
                    <span className="font-display text-xl md:text-2xl text-gravel group-hover:text-paper transition-colors duration-300 uppercase tracking-[1px] block leading-tight">
                      {name}
                    </span>
                    <div className="h-[1px] w-6 bg-gravel group-hover:bg-neon transition-all duration-300 mt-3 mb-2" />
                    <span className="text-[9px] font-mono uppercase tracking-[2px] text-stone group-hover:text-stone/80 transition-colors duration-300">
                      {count ? `${count} productos` : "Ver colección"}
                    </span>
                  </div>
                  <div className="absolute -bottom-4 -right-4 text-[5rem] md:text-[7rem] font-display text-gravel/5 group-hover:text-neon/5 transition-colors duration-500 select-none leading-none pointer-events-none">
                    {name[0]}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── STATEMENT ── */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 glow-statement pointer-events-none" />
        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <div className="max-w-[900px]">
            <p className="font-display text-[clamp(1.5rem,4vw,3.5rem)] text-paper uppercase leading-[1.1] tracking-[1px]">
              CREADOS PARA LA GRANDEZA. NO ES SOLO ROPA, ES UNA DECLARACIÓN.
            </p>
            <div className="h-[1px] w-16 bg-gradient-to-r from-neon to-transparent mt-8 mb-6" />
            <p className="text-sm text-stone font-body max-w-[500px] leading-relaxed">
              100% algodón premium. Cortes oversize. Producido en Venezuela con estándares globales.
            </p>
          </div>
        </div>
      </section>

      {/* ── PRODUCT GRID ── */}
      <SectionErrorBoundary>
        <section className="py-16 md:py-24 bg-smoke/50 relative overflow-hidden">
          <div className="absolute inset-0 glow-products pointer-events-none" />
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[3px] text-stone">Lo último</span>
              </div>
              <Link href="/tienda" className="text-[10px] font-mono uppercase tracking-[2px] text-gravel hover:text-paper transition-colors">
                Ver todo →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {(featured.length > 0 ? featured : PRODUCTS).map((item, i) => {
                if (typeof item === "object" && "images" in item) {
                  const p = item as Product;
                  return (
                    <Link key={p.id} href={`/tienda/${p.slug}`} className="group block">
                      <div className="aspect-[3/4] bg-smoke border border-border group-hover:border-neon/40 group-hover:shadow-[0_0_40px_rgba(0,255,26,0.06)] transition-all duration-500 flex items-center justify-center overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-neon/[0.03] to-transparent" />
                        {p.images[0] ? (
                          <Image src={p.images[0]} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="25vw" />
                        ) : (
                          <span className="font-display text-6xl md:text-8xl text-gravel group-hover:text-neon/20 transition-colors duration-500 select-none">
                            NS
                          </span>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-ink via-ink/60 to-transparent pt-12">
                          <span className="text-[9px] font-mono uppercase tracking-[2px] text-stone">{p.category?.name || ""}</span>
                        </div>
                      </div>
                      <div className="mt-3 px-0.5">
                        <h3 className="text-sm font-body font-medium text-paper group-hover:text-neon transition-colors truncate">
                          {p.name}
                        </h3>
                        <p className="text-neon font-mono text-sm mt-0.5 tracking-[1px]">${p.price.toFixed(2)}</p>
                      </div>
                    </Link>
                  );
                }
                const fake = item as typeof PRODUCTS[0];
                return (
                  <Link key={i} href="/tienda" className="group block">
                    <div className="aspect-[3/4] bg-smoke border border-border group-hover:border-neon/40 group-hover:shadow-[0_0_40px_rgba(0,255,26,0.06)] transition-all duration-500 flex items-center justify-center overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-neon/[0.03] to-transparent" />
                      <span className="font-display text-6xl md:text-8xl text-gravel group-hover:text-neon/20 transition-colors duration-500 select-none">
                        NS
                      </span>
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-ink via-ink/60 to-transparent pt-12">
                        <span className="text-[9px] font-mono uppercase tracking-[2px] text-stone">{fake.cat}</span>
                      </div>
                    </div>
                    <div className="mt-3 px-0.5">
                      <h3 className="text-sm font-body font-medium text-paper group-hover:text-neon transition-colors truncate">
                        {fake.name}
                      </h3>
                      <p className="text-neon font-mono text-sm mt-0.5 tracking-[1px]">${fake.price.toFixed(2)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </SectionErrorBoundary>

      {/* ── LOCATION / MAP ── */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[3px] text-stone">Ubicación</span>
              <h2 className="font-display text-4xl md:text-6xl text-paper uppercase leading-[0.9] tracking-[-1px] mt-4">
                Maracay,
                <br />
                <span className="text-neon">Aragua</span>
              </h2>
              <div className="h-[1px] w-12 bg-neon mt-6 mb-5" />
              <p className="text-sm text-stone font-body leading-relaxed max-w-[360px]">
                {STORE.address.line1}, {STORE.address.line2}. Estamos en el corazón de Maracay. 
                Hacemos envíos a todo Venezuela.
              </p>
              <a
                href={STORE.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 text-xs font-mono uppercase tracking-[2px] text-gravel hover:text-neon transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                Abrir en Google Maps →
              </a>
            </div>
            <div className="bg-smoke border border-border aspect-[4/3] overflow-hidden">
              <iframe
                src="https://www.google.com/maps?q=10.2526227,-67.6065823&z=17&output=embed"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                title="Ubicación NORTE SUR — Maracay"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── INSTAGRAM ── */}
      <SectionErrorBoundary>
        <section className="py-16 md:py-24 bg-smoke/30 relative overflow-hidden">
          <div className="absolute inset-0 glow-instagram pointer-events-none" />
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[3px] text-stone">Redes</span>
                <h2 className="font-display text-3xl md:text-5xl text-paper uppercase tracking-[1px] mt-2">
                  @{STORE.instagram}
                </h2>
              </div>
              <a
                href={`https://instagram.com/${STORE.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-mono uppercase tracking-[2px] text-gravel hover:text-paper transition-colors hidden sm:block"
              >
                Seguir →
              </a>
            </div>
            <InstagramFeed />
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <a href={`https://instagram.com/${STORE.instagram}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-stone hover:text-paper hover:border-paper text-xs font-mono uppercase tracking-[2px] transition-colors duration-300">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                Instagram
              </a>
              <a href={`https://tiktok.com/@${STORE.tiktok}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-stone hover:text-paper hover:border-paper text-xs font-mono uppercase tracking-[2px] transition-colors duration-300">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12a4 4 0 100 8 4 4 0 000-8zm0 0V4h6v2a4 4 0 004 4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                TikTok
              </a>
              <a href={`https://wa.me/${STORE.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-stone hover:text-paper hover:border-paper text-xs font-mono uppercase tracking-[2px] transition-colors duration-300">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>
        </section>
      </SectionErrorBoundary>

      {/* ── FINAL CTA ── */}
      <section className="py-24 md:py-36 relative overflow-hidden">
        <div className="absolute inset-0 glow-cta pointer-events-none" />
        <div className="max-w-[1400px] mx-auto px-6 text-center relative z-10">
          <p className="text-[10px] font-mono uppercase tracking-[3px] text-stone mb-6">¿Listo?</p>
          <h2 className="font-display text-[clamp(2.5rem,8vw,6rem)] text-paper uppercase leading-[0.85] tracking-[-2px]">
            Para hacer tu
            <br />
            <span className="text-neon">pedido</span>
          </h2>
          <div className="h-[1px] w-16 bg-neon mx-auto mt-8 mb-6" />
          <p className="text-sm text-stone font-body max-w-[400px] mx-auto leading-relaxed mb-10">
            Agregá tus productos al carrito y procesá tu compra directo desde la tienda. Envíos a todo Venezuela.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/tienda"
              className="inline-flex items-center gap-2 px-8 py-4 bg-neon text-ink text-xs font-mono uppercase tracking-[2px] hover:bg-neon-dim transition-colors duration-300"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
              Ir a la tienda
            </Link>
            <Link
              href="/tienda"
              className="inline-flex items-center gap-2 px-8 py-4 border border-gravel text-gravel hover:text-paper hover:border-paper text-xs font-mono uppercase tracking-[2px] transition-colors duration-300"
            >
              Ver catálogo
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHATSAPP FLOATING ── */}
      <a
        href={`https://wa.me/${STORE.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-neon text-ink flex items-center justify-center shadow-lg hover:bg-neon-dim transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="Contactar por WhatsApp"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </>
  );
}
