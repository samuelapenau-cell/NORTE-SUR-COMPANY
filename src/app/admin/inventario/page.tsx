"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

type Variant = {
  id: string;
  product_id: string;
  size: string;
  color: string;
  stock: number;
  sku: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
  };
};

type GroupedProduct = {
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string;
  variants: Variant[];
};

function groupByProduct(variants: Variant[]): GroupedProduct[] {
  const map = new Map<string, GroupedProduct>();
  for (const v of variants) {
    if (!map.has(v.product_id)) {
      map.set(v.product_id, {
        productId: v.product_id,
        productName: v.product.name,
        productSlug: v.product.slug,
        productImage: v.product.images?.[0] || "",
        variants: [],
      });
    }
    map.get(v.product_id)!.variants.push(v);
  }
  return Array.from(map.values());
}

export default function AdminInventario() {
  const [groups, setGroups] = useState<GroupedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState(0);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const fetchInventory = useCallback(async () => {
    const res = await fetch("/api/admin/inventory");
    const data = await res.json();
    setGroups(groupByProduct(data.variants || []));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const startEdit = (variant: Variant) => {
    setEditingId(variant.id);
    setEditValue(variant.stock);
  };

  const saveStock = async (variantId: string) => {
    setSaving(true);
    await fetch(`/api/admin/inventory/${variantId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: editValue }),
    });
    setSaving(false);
    setEditingId(null);
    fetchInventory();
  };

  const filtered = search
    ? groups.filter((g) =>
        g.productName.toLowerCase().includes(search.toLowerCase())
      )
    : groups;

  const totalStock = (variants: Variant[]) =>
    variants.reduce((s, v) => s + v.stock, 0);

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[2.5px] text-neon">
              Admin / Inventario
            </span>
            <h1 className="mt-2 font-display text-4xl md:text-5xl text-paper tracking-[2px]">
              Control de <span className="text-neon">Stock</span>
            </h1>
          </div>
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 bg-smoke border border-border rounded-sm text-sm text-paper/70 placeholder:text-paper/20 font-mono uppercase tracking-[1px] focus:outline-none focus:border-neon/50 w-full md:w-64"
          />
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-smoke border border-border/50 animate-pulse rounded-sm" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 bg-smoke border border-border rounded-sm text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neon/10 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neon">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <p className="text-paper/40 text-sm">
              {search ? "No se encontraron productos" : "No hay variantes registradas."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((group) => (
              <div
                key={group.productId}
                className="bg-smoke border border-border rounded-sm overflow-hidden"
              >
                <div className="p-4 bg-smoke/50 border-b border-border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-smoke flex-shrink-0 overflow-hidden">
                    {group.productImage && (
                      <Image src={group.productImage} alt={group.productName} width={40} height={40} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Link
                      href={`/tienda/${group.productSlug}`}
                      className="text-sm text-paper/80 hover:text-neon transition-colors"
                    >
                      {group.productName}
                    </Link>
                    <p className="text-[10px] text-paper/30 font-mono">{group.productSlug}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-display text-neon tracking-[1px]">
                      {totalStock(group.variants)}
                    </p>
                    <p className="text-[10px] text-paper/30 font-mono uppercase tracking-[1px]">
                      Total stock
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-[10px] font-mono uppercase tracking-[1.5px] text-paper/30">
                        <th className="p-3 pl-4 font-normal">SKU</th>
                        <th className="p-3 font-normal">Talla</th>
                        <th className="p-3 font-normal">Color</th>
                        <th className="p-3 font-normal">Stock</th>
                        <th className="p-3 font-normal w-24">Accion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.variants.map((variant) => {
                        const isLow = variant.stock > 0 && variant.stock < 5;
                        const isOut = variant.stock === 0;
                        return (
                          <tr
                            key={variant.id}
                            className={`border-b border-border/30 last:border-0 ${
                              isOut ? "bg-red-500/5" : isLow ? "bg-yellow-500/5" : ""
                            }`}
                          >
                            <td className="p-3 pl-4">
                              <span className="text-xs font-mono text-paper/50">
                                {variant.sku}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className="text-xs text-paper/70">{variant.size}</span>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-3 h-3 rounded-full border border-border"
                                  style={{ backgroundColor: variant.color.toLowerCase() }}
                                />
                                <span className="text-xs text-paper/70">{variant.color}</span>
                              </div>
                            </td>
                            <td className="p-3">
                              {editingId === variant.id ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    value={editValue}
                                    onChange={(e) => setEditValue(parseInt(e.target.value) || 0)}
                                    min={0}
                                    autoFocus
                                    className="w-20 px-2 py-1 bg-smoke border border-neon/50 rounded-sm text-sm text-paper/80 focus:outline-none"
                                  />
                                  <button
                                    onClick={() => saveStock(variant.id)}
                                    disabled={saving}
                                    className="text-[10px] font-mono uppercase tracking-[1px] text-neon hover:text-neon-dim disabled:opacity-30 transition-colors"
                                  >
                                    {saving ? "..." : "Guardar"}
                                  </button>
                                  <button
                                    onClick={() => setEditingId(null)}
                                    className="text-[10px] font-mono uppercase tracking-[1px] text-paper/30 hover:text-paper/50 transition-colors"
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-sm font-mono ${
                                      isOut
                                        ? "text-red-400"
                                        : isLow
                                          ? "text-yellow-400"
                                          : "text-paper/80"
                                    }`}
                                  >
                                    {variant.stock}
                                  </span>
                                  {isOut && (
                                    <span className="text-[9px] font-mono uppercase tracking-[1px] px-1.5 py-0.5 bg-red-500/10 text-red-400 rounded-sm">
                                      Sin stock
                                    </span>
                                  )}
                                  {isLow && (
                                    <span className="text-[9px] font-mono uppercase tracking-[1px] px-1.5 py-0.5 bg-yellow-500/10 text-yellow-400 rounded-sm">
                                      Bajo
                                    </span>
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="p-3">
                              <button
                                onClick={() => startEdit(variant)}
                                className="text-[10px] font-mono uppercase tracking-[1px] px-3 py-1.5 bg-smoke border border-border rounded-sm text-paper/50 hover:text-neon hover:border-neon/50 transition-all"
                              >
                                Editar
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
