"use client";

import { useEffect, useState, useCallback } from "react";
import type { Coupon } from "@/types";

const emptyForm = {
  code: "",
  discount_type: "percentage" as "percentage" | "fixed",
  discount_value: 0,
  min_purchase: 0,
  max_uses: null as number | null,
  active: true,
  expires_at: "",
};

export default function AdminCupones() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchCoupons = useCallback(async () => {
    const res = await fetch("/api/admin/coupons");
    const data = await res.json();
    setCoupons(data.coupons || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchCoupons(); }, [fetchCoupons]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (coupon: Coupon) => {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_purchase: coupon.min_purchase,
      max_uses: coupon.max_uses,
      active: coupon.active,
      expires_at: coupon.expires_at ? coupon.expires_at.slice(0, 16) : "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const url = editingId ? `/api/admin/coupons/${editingId}` : "/api/admin/coupons";
    const method = editingId ? "PUT" : "POST";

    const payload = {
      ...form,
      expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
    };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (res.ok) {
      setShowModal(false);
      setEditingId(null);
      setForm(emptyForm);
      fetchCoupons();
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    if (res.ok) {
      setDeleteConfirm(null);
      fetchCoupons();
    }
  };

  const toggleActive = async (coupon: Coupon) => {
    await fetch(`/api/admin/coupons/${coupon.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !coupon.active }),
    });
    fetchCoupons();
  };

  const now = new Date();
  const filtered = coupons.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[2.5px] text-neon">
              Admin / Cupones
            </span>
            <h1 className="mt-2 font-display text-4xl md:text-5xl text-paper tracking-[2px]">
              Cupones de <span className="text-neon">Descuento</span>
            </h1>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Buscar cupones..."
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
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-smoke border border-border/50 animate-pulse rounded-sm" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 bg-smoke border border-border rounded-sm text-center">
            <p className="text-paper/40 text-sm">
              {search ? "No se encontraron cupones" : "No hay cupones todavía. Creá el primer cupón."}
            </p>
          </div>
        ) : (
          <div className="bg-smoke border border-border rounded-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-[10px] font-mono uppercase tracking-[1.5px] text-paper/30">
                    <th className="p-4 font-normal">Código</th>
                    <th className="p-4 font-normal">Descuento</th>
                    <th className="p-4 font-normal">Compra Mín.</th>
                    <th className="p-4 font-normal">Usos</th>
                    <th className="p-4 font-normal">Vence</th>
                    <th className="p-4 font-normal">Estado</th>
                    <th className="p-4 font-normal w-24">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((coupon) => {
                    const expired = coupon.expires_at && new Date(coupon.expires_at) < now;
                    const maxed = coupon.max_uses !== null && coupon.used_count >= coupon.max_uses;
                    const isActive = coupon.active && !expired && !maxed;
                    return (
                      <tr key={coupon.id} className="border-b border-border/50 last:border-0 hover:bg-smoke/50 transition-colors">
                        <td className="p-4">
                          <div>
                            <span className="text-paper/80 font-mono tracking-[1px]">{coupon.code}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-neon font-display tracking-[1px]">
                            {coupon.discount_type === "percentage"
                              ? `${coupon.discount_value}%`
                              : `$${Number(coupon.discount_value).toFixed(2)}`}
                          </span>
                        </td>
                        <td className="p-4 text-paper/50 font-mono text-xs">
                          ${Number(coupon.min_purchase).toFixed(2)}
                        </td>
                        <td className="p-4">
                          <span className="text-paper/60 font-mono text-xs">
                            {coupon.used_count}
                            {coupon.max_uses !== null ? ` / ${coupon.max_uses}` : ""}
                          </span>
                        </td>
                        <td className="p-4">
                          {coupon.expires_at ? (
                            <span className={`text-[10px] font-mono ${expired ? "text-red-400" : "text-paper/40"}`}>
                              {new Date(coupon.expires_at).toLocaleDateString("es-VE", {
                                day: "2-digit", month: "2-digit", year: "numeric",
                              })}
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-paper/20">—</span>
                          )}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => toggleActive(coupon)}
                            className="flex items-center gap-2"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-400" : "bg-red-400"}`} />
                            <span className="text-[10px] font-mono uppercase tracking-[1px] text-paper/40">
                              {isActive ? "Activo" : expired ? "Vencido" : maxed ? "Agotado" : "Inactivo"}
                            </span>
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEdit(coupon)}
                              className="text-[10px] font-mono uppercase tracking-[1px] px-3 py-1.5 bg-smoke border border-border rounded-sm text-paper/50 hover:text-neon hover:border-neon/50 transition-all"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(coupon.id)}
                              className="text-[10px] font-mono uppercase tracking-[1px] px-3 py-1.5 bg-smoke border border-accent/20 rounded-sm text-accent/50 hover:text-accent hover:border-accent/50 transition-all"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 pb-10 px-4 overflow-y-auto">
            <div className="fixed inset-0 bg-black/70" onClick={() => setShowModal(false)} />
            <div className="relative w-full max-w-lg bg-smoke border border-border rounded-sm p-8">
              <h2 className="font-display text-2xl text-paper tracking-[1px] mb-6">
                {editingId ? "Editar Cupón" : "Nuevo Cupón"}
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[1.5px] text-paper/40 mb-1.5">
                    Código
                  </label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                    placeholder="EJ: VERANO30"
                    maxLength={30}
                    className="w-full px-3 py-2 bg-smoke border border-border rounded-sm text-sm text-paper/80 font-mono tracking-[1px] focus:outline-none focus:border-neon/50 uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-[1.5px] text-paper/40 mb-1.5">
                      Tipo
                    </label>
                    <select
                      value={form.discount_type}
                      onChange={(e) => setForm((f) => ({ ...f, discount_type: e.target.value as "percentage" | "fixed" }))}
                      className="w-full px-3 py-2 bg-smoke border border-border rounded-sm text-sm text-paper/80 focus:outline-none focus:border-neon/50"
                    >
                      <option value="percentage">Porcentaje (%)</option>
                      <option value="fixed">Monto Fijo ($)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-[1.5px] text-paper/40 mb-1.5">
                      {form.discount_type === "percentage" ? "Porcentaje (%)" : "Monto ($)"}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.discount_value}
                      onChange={(e) => setForm((f) => ({ ...f, discount_value: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 bg-smoke border border-border rounded-sm text-sm text-paper/80 focus:outline-none focus:border-neon/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-[1.5px] text-paper/40 mb-1.5">
                      Compra Mínima ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.min_purchase}
                      onChange={(e) => setForm((f) => ({ ...f, min_purchase: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 bg-smoke border border-border rounded-sm text-sm text-paper/80 focus:outline-none focus:border-neon/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-[1.5px] text-paper/40 mb-1.5">
                      Usos Máximos
                    </label>
                    <input
                      type="number"
                      value={form.max_uses ?? ""}
                      onChange={(e) => setForm((f) => ({ ...f, max_uses: e.target.value ? parseInt(e.target.value) : null }))}
                      placeholder="Sin límite"
                      className="w-full px-3 py-2 bg-smoke border border-border rounded-sm text-sm text-paper/80 placeholder:text-paper/20 focus:outline-none focus:border-neon/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[1.5px] text-paper/40 mb-1.5">
                    Fecha de Vencimiento
                  </label>
                  <input
                    type="datetime-local"
                    value={form.expires_at}
                    onChange={(e) => setForm((f) => ({ ...f, expires_at: e.target.value }))}
                    className="w-full px-3 py-2 bg-smoke border border-border rounded-sm text-sm text-paper/80 focus:outline-none focus:border-neon/50"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-2">
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

              <div className="mt-8 flex gap-3 justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-xs font-mono uppercase tracking-[2px] text-paper/40 hover:text-paper/70 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !form.code || form.discount_value <= 0}
                  className="px-6 py-2.5 bg-neon text-surface text-xs font-mono uppercase tracking-[2px] rounded-sm hover:bg-neon-dim disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  {saving ? "Guardando..." : editingId ? "Actualizar" : "Crear Cupón"}
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
                ¿Eliminar este cupón? Esta acción no se puede deshacer.
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
