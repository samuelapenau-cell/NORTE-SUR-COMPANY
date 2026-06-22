"use client";

import { Suspense, useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import type { Product, Category } from "@/types";

const COLORS = ["Negro", "Blanco", "Gris", "Beige", "Marrón", "Camuflado", "Verde Militar", "Azul Marino"];
const SIZES = ["S", "M", "L", "XL", "2XL"];

function CatalogContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("categoria") || ""
  );
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(12);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout>>();

  const activeFilterCount = [selectedCategory, selectedSize, selectedColor].filter(Boolean).length;
  const hasActiveFilters = activeFilterCount > 0 || priceRange[0] > 0 || priceRange[1] < 200;

  const loadProducts = useCallback(async (searchQuery?: string) => {
    try {
      const url = searchQuery
        ? `/api/products?search=${encodeURIComponent(searchQuery)}&limit=50`
        : "/api/products?limit=100";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
      const catRes = await fetch("/api/categories");
      if (catRes.ok) {
        const data = await catRes.json();
        setCategories(data.categories || []);
      }
    } catch {
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (search.trim().length > 0) {
      setSearchLoading(true);
      searchTimer.current = setTimeout(() => {
        loadProducts(search.trim());
      }, 400);
    } else if (search === "") {
      if (products.length === 0 || searchLoading) {
        loadProducts();
      }
    }
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
  }, [search, loadProducts, products.length, searchLoading]);

  useEffect(() => {
    const cat = searchParams.get("categoria");
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      if (selectedCategory && p.category?.slug !== selectedCategory)
        return false;
      if (selectedSize && !p.variants.some((v) => v.size === selectedSize))
        return false;
      if (selectedColor && !p.variants.some((v) => v.color === selectedColor))
        return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      return true;
    });

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [products, selectedCategory, selectedSize, selectedColor, priceRange, sortBy]);

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedSize("");
    setSelectedColor("");
    setPriceRange([0, 200]);
    setSearch("");
  };

  const handleLoadMore = () => {
    setVisibleCount((c) => c + 12);
  };

  return (
    <div className="pt-20 pb-16 px-6 max-w-[1400px] mx-auto">
      {/* Hero */}
      <div className="mb-14">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-8 h-[1px] bg-neon/50" />
          <span className="text-[10px] font-mono uppercase tracking-[3px] text-neon/60">Catálogo</span>
        </div>
        <h1 className="font-display text-6xl md:text-8xl text-paper tracking-[1px] uppercase leading-[0.9]">
          Tienda
        </h1>
        <div className="mt-2 flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
          <span className="font-display text-5xl md:text-7xl text-neon tracking-[1px] uppercase leading-none">
            NORTE SUR
          </span>
          <span className="text-xs font-mono uppercase tracking-[3px] text-stone/50 md:self-end md:pb-2">
            Streetwear · Maracay
          </span>
        </div>
        <p className="mt-5 text-sm text-stone font-body max-w-lg leading-relaxed">
          Franelas oversize, hoodies, joggers, gorras y accesorios. Algodón premium, corte oversize, estilo urbano.
        </p>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <div className="relative flex-1 max-w-md">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone/40 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-smoke border border-border rounded-sm px-4 py-3 pl-10 text-sm text-paper/70 placeholder-stone/40 font-body outline-none focus:border-neon/40 transition-colors"
          />
          {searchLoading && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border border-neon/40 border-t-transparent animate-spin" />
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-mono uppercase tracking-[1.5px] border rounded-sm transition-all duration-200 ${
              showFilters || hasActiveFilters
                ? "border-neon/40 text-neon bg-neon/5"
                : "border-border text-stone/60 hover:text-paper/70 hover:border-stone/40"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
              <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" />
              <line x1="17" y1="16" x2="23" y2="16" />
            </svg>
            Filtros
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-neon text-ink text-[9px] font-bold flex items-center justify-center font-mono">{activeFilterCount}</span>
            )}
          </button>
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setVisibleCount(12); }}
            className="px-3 py-3 bg-smoke border border-border rounded-sm text-xs font-mono text-stone/60 outline-none focus:border-neon/40 transition-colors uppercase tracking-[1px] cursor-pointer appearance-none"
          >
            <option value="newest">Más nuevo</option>
            <option value="price-asc">Menor precio</option>
            <option value="price-desc">Mayor precio</option>
            <option value="name">Nombre A-Z</option>
          </select>
        </div>
      </div>

      {/* Expandable Filters Panel */}
      <div className={`overflow-hidden transition-all duration-300 ${showFilters ? "max-h-[600px] opacity-100 mb-8" : "max-h-0 opacity-0 mb-0"}`}>
        <div className="bg-smoke border border-border rounded-sm p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {/* Category */}
            <div>
              <h3 className="text-[9px] font-mono uppercase tracking-[2px] text-neon/60 mb-3">Categoría</h3>
              <div className="flex flex-wrap gap-1.5">
                <button onClick={() => setSelectedCategory("")}
                  className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-[1px] rounded-sm border transition-all ${
                    !selectedCategory ? "bg-neon text-ink border-neon" : "bg-transparent text-stone/60 border-border hover:text-paper/70 hover:border-stone/40"
                  }`}>Todas</button>
                {categories.filter((c) => c.slug !== "todas").map((cat) => (
                  <button key={cat.slug} onClick={() => setSelectedCategory(selectedCategory === cat.slug ? "" : cat.slug)}
                    className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-[1px] rounded-sm border transition-all ${
                      selectedCategory === cat.slug ? "bg-neon text-ink border-neon" : "bg-transparent text-stone/60 border-border hover:text-paper/70 hover:border-stone/40"
                    }`}>{cat.name}</button>
                ))}
              </div>
            </div>
            {/* Size */}
            <div>
              <h3 className="text-[9px] font-mono uppercase tracking-[2px] text-neon/60 mb-3">Talla</h3>
              <div className="flex flex-wrap gap-1.5">
                {SIZES.map((size) => (
                  <button key={size} onClick={() => setSelectedSize(selectedSize === size ? "" : size)}
                    className={`w-9 h-9 flex items-center justify-center text-[10px] font-mono rounded-sm border transition-all ${
                      selectedSize === size ? "bg-neon text-ink border-neon" : "bg-transparent text-stone/60 border-border hover:text-paper/70 hover:border-stone/40"
                    }`}>{size}</button>
                ))}
              </div>
            </div>
            {/* Color */}
            <div>
              <h3 className="text-[9px] font-mono uppercase tracking-[2px] text-neon/60 mb-3">Color</h3>
              <div className="flex flex-wrap gap-1.5">
                {COLORS.map((color) => (
                  <button key={color} onClick={() => setSelectedColor(selectedColor === color ? "" : color)}
                    className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-[1px] rounded-sm border transition-all ${
                      selectedColor === color ? "bg-neon text-ink border-neon" : "bg-transparent text-stone/60 border-border hover:text-paper/70 hover:border-stone/40"
                    }`}>{color}</button>
                ))}
              </div>
            </div>
            {/* Price */}
            <div>
              <h3 className="text-[9px] font-mono uppercase tracking-[2px] text-neon/60 mb-3">Precio</h3>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="0" value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-full bg-ink border border-border rounded-sm px-3 py-2 text-xs text-paper/60 font-mono placeholder-stone/40 outline-none focus:border-neon/40 transition-colors" />
                <span className="text-stone/40 text-xs">—</span>
                <input type="number" placeholder="200" value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full bg-ink border border-border rounded-sm px-3 py-2 text-xs text-paper/60 font-mono placeholder-stone/40 outline-none focus:border-neon/40 transition-colors" />
              </div>
            </div>
          </div>
          {hasActiveFilters && (
            <button onClick={clearFilters}
              className="text-[10px] font-mono uppercase tracking-[2px] text-stone/50 hover:text-neon transition-colors flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Products */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-smoke border border-border rounded-sm animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 mb-6 rounded-full border border-neon/20 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-neon/40">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <p className="text-paper/50 text-sm font-body mb-1">No hay resultados</p>
          <p className="text-stone/40 text-xs font-mono mb-6">Probá con otros filtros o términos</p>
          <button onClick={clearFilters}
            className="px-5 py-2.5 border border-neon/30 text-neon text-[10px] font-mono uppercase tracking-[2px] rounded-sm hover:bg-neon/10 transition-all">
            Limpiar filtros
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/10">
            <p className="text-xs text-stone/50 font-mono flex items-center gap-2.5">
              {searchLoading && <span className="w-3 h-3 rounded-full border border-neon/40 border-t-transparent animate-spin" />}
              <span className="text-paper/60">{filtered.length}</span>
              <span className="text-stone/40">producto{filtered.length !== 1 ? "s" : ""}</span>
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.slice(0, visibleCount).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {visibleCount < filtered.length && (
            <div className="mt-12 text-center">
              <button onClick={handleLoadMore}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 border border-border/50 text-stone/60 hover:text-neon hover:border-neon/30 font-mono text-[10px] uppercase tracking-[2px] rounded-sm transition-all duration-300">
                <span>Mostrar más ({filtered.length - visibleCount})</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <polyline points="19 12 12 19 5 12" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="pt-20 pb-16 px-6 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-8 h-[1px] bg-neon/30" />
          <span className="h-3 w-16 bg-neon/20 rounded-sm animate-pulse" />
        </div>
        <div className="h-16 w-48 bg-paper/5 rounded-sm animate-pulse mb-2" />
        <div className="h-14 w-64 bg-neon/10 rounded-sm animate-pulse mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-smoke border border-border rounded-sm animate-pulse" />
          ))}
        </div>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
