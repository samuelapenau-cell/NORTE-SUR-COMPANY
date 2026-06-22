"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ImageUploader } from "@/components/ImageUploader";

type Variant = {
  id?: string;
  size: string;
  color: string;
  stock: number;
  sku: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category_id: string;
  category: { id: string; name: string; slug: string } | null;
  images: string[];
  featured: boolean;
  active: boolean;
  variants: Variant[];
  created_at: string;
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

const emptyProduct = {
  name: "",
  slug: "",
  description: "",
  price: 0,
  category_id: "",
  images: [] as string[],
  featured: false,
  active: true,
  variants: [{ size: "", color: "", stock: 0, sku: "" }],
};

export default function AdminProductos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  }, []);

  const fetchCategories = useCallback(async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data.categories || []);
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const handleNameChange = (name: string) => {
    setForm((f) => ({
      ...f,
      name,
      slug: editingId ? f.slug : generateSlug(name),
    }));
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyProduct);
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      category_id: product.category_id,
      images: product.images,
      featured: product.featured,
      active: product.active,
      variants:
        product.variants.length > 0
          ? product.variants.map((v) => ({
              size: v.size,
              color: v.color,
              stock: v.stock,
              sku: v.sku,
            }))
          : [{ size: "", color: "", stock: 0, sku: "" }],
    });
    setShowModal(true);
  };

  const addVariant = () => {
    setForm((f) => ({
      ...f,
      variants: [...f.variants, { size: "", color: "", stock: 0, sku: "" }],
    }));
  };

  const removeVariant = (i: number) => {
    setForm((f) => ({
      ...f,
      variants: f.variants.filter((_, idx) => idx !== i),
    }));
  };

  const updateVariant = (i: number, field: keyof Variant, value: string | number) => {
    setForm((f) => {
      const variants = f.variants.map((v, idx) => (idx === i ? { ...v, [field]: value } : v));
      return { ...f, variants };
    });
  };

  const addImage = () => {
    setForm((f) => ({ ...f, images: [...f.images, ""] }));
  };

  const updateImage = (i: number, value: string) => {
    setForm((f) => {
      const images = f.images.map((img, idx) => (idx === i ? value : img));
      return { ...f, images };
    });
  };

  const removeImage = (i: number) => {
    setForm((f) => ({
      ...f,
      images: f.images.filter((_, idx) => idx !== i),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const url = editingId
      ? `/api/admin/products/${editingId}`
      : "/api/admin/products";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (res.ok) {
      setShowModal(false);
      setEditingId(null);
      setForm(emptyProduct);
      fetchProducts();
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setDeleteConfirm(null);
      fetchProducts();
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  const totalStock = (variants: Variant[]) =>
    variants.reduce((sum, v) => sum + v.stock, 0);

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[2.5px] text-neon">
              Admin / Productos
            </span>
            <h1 className="mt-2 font-display text-4xl md:text-5xl text-paper tracking-[2px]">
              Todos los <span className="text-neon">Productos</span>
            </h1>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 bg-smoke border border-border rounded-sm text-sm text-paper/70 placeholder:text-paper/20 font-mono uppercase tracking-[1px] focus:outline-none focus:border-neon/50 w-full md:w-64"
            />
            <button
              onClick={openCreate}
              className="px-5 py-2 bg-neon text-surface text-xs font-mono uppercase tracking-[2px] rounded-sm hover:bg-neon-dim transition-colors whitespace-nowrap"
            >
              + Nuevo
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-smoke border border-border/50 animate-pulse rounded-sm" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 bg-smoke border border-border rounded-sm text-center">
            <p className="text-paper/40 text-sm">
              {search ? "No se encontraron productos" : "No hay productos aun. Crea tu primer producto."}
            </p>
          </div>
        ) : (
          <div className="bg-smoke border border-border rounded-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-[10px] font-mono uppercase tracking-[1.5px] text-paper/30">
                    <th className="p-4 font-normal">Producto</th>
                    <th className="p-4 font-normal">Precio</th>
                    <th className="p-4 font-normal">Categoria</th>
                    <th className="p-4 font-normal">Stock</th>
                    <th className="p-4 font-normal">Estado</th>
                    <th className="p-4 font-normal w-24">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => (
                    <tr key={product.id} className="border-b border-border/50 last:border-0 hover:bg-smoke/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-sm bg-smoke flex-shrink-0 overflow-hidden">
                            {product.images[0] && (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <p className="text-paper/80 font-medium">{product.name}</p>
                            <p className="text-[10px] text-paper/30 font-mono">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-paper/70">${Number(product.price).toFixed(2)}</td>
                      <td className="p-4">
                        <span className="text-[10px] font-mono uppercase tracking-[1px] px-2 py-1 bg-smoke rounded-sm text-paper/50">
                          {product.category?.name || "—"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-xs font-mono ${
                            totalStock(product.variants) === 0
                              ? "text-red-400"
                              : totalStock(product.variants) < 10
                                ? "text-yellow-400"
                                : "text-paper/70"
                          }`}
                        >
                          {totalStock(product.variants)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              product.active ? "bg-green-400" : "bg-red-400"
                            }`}
                          />
                          <span className="text-[10px] font-mono uppercase tracking-[1px] text-paper/40">
                            {product.active ? "Activo" : "Inactivo"}
                          </span>
                          {product.featured && (
                            <span className="text-[10px] font-mono uppercase tracking-[1px] text-neon ml-2">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="inline -mt-0.5 mr-1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>Destacado
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEdit(product)}
                            className="text-[10px] font-mono uppercase tracking-[1px] px-3 py-1.5 bg-smoke border border-border rounded-sm text-paper/50 hover:text-neon hover:border-neon/50 transition-all"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(product.id)}
                            className="text-[10px] font-mono uppercase tracking-[1px] px-3 py-1.5 bg-smoke border border-accent/20 rounded-sm text-accent/50 hover:text-accent hover:border-accent/50 transition-all"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 pb-10 px-4 overflow-y-auto">
            <div className="fixed inset-0 bg-black/70" onClick={() => setShowModal(false)} />
            <div className="relative w-full max-w-2xl bg-smoke border border-border rounded-sm p-8">
              <h2 className="font-display text-2xl text-paper tracking-[1px] mb-6">
                {editingId ? "Editar Producto" : "Nuevo Producto"}
              </h2>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-[1.5px] text-paper/40 mb-1.5">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full px-3 py-2 bg-smoke border border-border rounded-sm text-sm text-paper/80 focus:outline-none focus:border-neon/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-[1.5px] text-paper/40 mb-1.5">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                      className="w-full px-3 py-2 bg-smoke border border-border rounded-sm text-sm text-paper/80 focus:outline-none focus:border-neon/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[1.5px] text-paper/40 mb-1.5">
                    Descripcion
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 bg-smoke border border-border rounded-sm text-sm text-paper/80 focus:outline-none focus:border-neon/50 resize-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-[1.5px] text-paper/40 mb-1.5">
                      Precio ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => setForm((f) => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 bg-smoke border border-border rounded-sm text-sm text-paper/80 focus:outline-none focus:border-neon/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-[1.5px] text-paper/40 mb-1.5">
                      Categoria
                    </label>
                    <select
                      value={form.category_id}
                      onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                      className="w-full px-3 py-2 bg-smoke border border-border rounded-sm text-sm text-paper/80 focus:outline-none focus:border-neon/50"
                    >
                      <option value="">Sin categoria</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end gap-3 pb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                        className="accent-gold"
                      />
                      <span className="text-[10px] font-mono uppercase tracking-[1.5px] text-paper/40">
                        Destacado
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.active}
                        onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                        className="accent-gold"
                      />
                      <span className="text-[10px] font-mono uppercase tracking-[1.5px] text-paper/40">
                        Activo
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-[1.5px] text-paper/40">
                      Imagenes
                    </label>
                    {form.images.length > 0 && form.images.length < 5 && (
                      <button
                        onClick={addImage}
                        className="text-[10px] font-mono uppercase tracking-[1px] text-neon hover:text-neon-dim transition-colors"
                      >
                        + Agregar URL
                      </button>
                    )}
                  </div>
                  <ImageUploader images={form.images} onImagesChange={(imgs) => setForm((f) => ({ ...f, images: imgs }))} />
                  {form.images.map((img, i) => (
                    <div key={i} className="flex gap-2 mb-2 mt-2">
                      <input
                        type="text"
                        value={img}
                        onChange={(e) => updateImage(i, e.target.value)}
                        placeholder="https://..."
                        className="flex-1 px-3 py-2 bg-smoke border border-border rounded-sm text-sm text-paper/80 placeholder:text-paper/20 focus:outline-none focus:border-neon/50 font-mono text-xs"
                      />
                      <button
                        onClick={() => removeImage(i)}
                        className="text-[10px] font-mono uppercase tracking-[1px] text-accent/50 hover:text-accent transition-colors"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-[1.5px] text-paper/40">
                      Variantes
                    </label>
                    <button
                      onClick={addVariant}
                      className="text-[10px] font-mono uppercase tracking-[1px] text-neon hover:text-neon-dim transition-colors"
                    >
                      + Agregar
                    </button>
                  </div>
                  {form.variants.map((v, i) => (
                    <div key={i} className="grid grid-cols-4 gap-2 mb-2">
                      <input
                        type="text"
                        value={v.size}
                        onChange={(e) => updateVariant(i, "size", e.target.value)}
                        placeholder="Talla"
                        className="px-3 py-2 bg-smoke border border-border rounded-sm text-sm text-paper/80 placeholder:text-paper/20 focus:outline-none focus:border-neon/50"
                      />
                      <input
                        type="text"
                        value={v.color}
                        onChange={(e) => updateVariant(i, "color", e.target.value)}
                        placeholder="Color"
                        className="px-3 py-2 bg-smoke border border-border rounded-sm text-sm text-paper/80 placeholder:text-paper/20 focus:outline-none focus:border-neon/50"
                      />
                      <input
                        type="number"
                        value={v.stock}
                        onChange={(e) => updateVariant(i, "stock", parseInt(e.target.value) || 0)}
                        placeholder="Stock"
                        className="px-3 py-2 bg-smoke border border-border rounded-sm text-sm text-paper/80 placeholder:text-paper/20 focus:outline-none focus:border-neon/50"
                      />
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={v.sku}
                          onChange={(e) => updateVariant(i, "sku", e.target.value)}
                          placeholder="SKU"
                          className="flex-1 px-3 py-2 bg-smoke border border-border rounded-sm text-sm text-paper/80 placeholder:text-paper/20 focus:outline-none focus:border-neon/50 font-mono text-xs"
                        />
                        {form.variants.length > 1 && (
                          <button
                            onClick={() => removeVariant(i)}
                            className="ml-2 text-[10px] font-mono uppercase tracking-[1px] text-accent/50 hover:text-accent transition-colors"
                          >
                            X
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex gap-3 justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-xs font-mono uppercase tracking-[2px] text-paper/40 hover:text-paper/70 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !form.name || !form.slug}
                  className="px-6 py-2.5 bg-neon text-surface text-xs font-mono uppercase tracking-[2px] rounded-sm hover:bg-neon-dim disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  {saving ? "Guardando..." : editingId ? "Actualizar" : "Crear Producto"}
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/70" onClick={() => setDeleteConfirm(null)} />
            <div className="relative bg-smoke border border-border rounded-sm p-8 max-w-sm w-full text-center">
              <p className="text-paper/80 font-body text-sm mb-6">
                ¿Eliminar este producto? Esta accion no se puede deshacer.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-5 py-2.5 text-xs font-mono uppercase tracking-[2px] text-paper/40 hover:text-paper/70 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-5 py-2.5 bg-accent text-white text-xs font-mono uppercase tracking-[2px] rounded-sm hover:bg-red-600 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
