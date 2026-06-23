"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useCart } from "@/components/CartProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { STORE } from "@/lib/constants";

type Order = {
  id: string;
  total: number;
  status: string;
  created_at: string;
  items: { id: string; product_name: string; variant_label: string; quantity: number; price: number }[];
};

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendiente", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  confirmed: { label: "Confirmado", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  shipped: { label: "Enviado", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  delivered: { label: "Entregado", color: "bg-green-500/10 text-green-400 border-green-500/20" },
  cancelled: { label: "Cancelado", color: "bg-red-500/10 text-red-400 border-red-500/20" },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    date: d.toLocaleDateString("es-VE", { year: "numeric", month: "long", day: "numeric" }),
    time: d.toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit" }),
  };
}

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase());

export default function PerfilPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { items: cartItems, totalItems, totalPrice, removeItem, updateQuantity } = useCart();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pedidos" | "carrito" | "perfil">("pedidos");
  const [profile, setProfile] = useState({ name: "", phone: "", address: "" });
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/ingresar"); return; }
    if (ADMIN_EMAILS.includes(user.email?.toLowerCase() || "")) { router.push("/admin"); return; }

    fetch("/api/user/orders")
      .then((r) => r.json())
      .then((data) => setOrders(data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));

    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.profile) setProfile(data.profile);
      })
      .catch(() => {})
      .finally(() => setProfileLoading(false));
  }, [user, authLoading, router]);

  const saveProfile = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  const cancelOrder = async (orderId: string) => {
    if (!confirm("¿Cancelar este pedido?")) return;
    setCancelling(orderId);
    await fetch(`/api/user/orders/${orderId}/cancel`, { method: "POST" });
    setCancelling(null);
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: "cancelled" } : o));
  };

  if (authLoading || !user) return null;

  const totalSpent = orders.reduce((sum, o) => sum + Number(o.total), 0);
  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "confirmed").length;

  const tabs = [
    { id: "pedidos" as const, label: "Pedidos", count: orders.length },
    { id: "carrito" as const, label: "Carrito", count: cartItems.length },
    { id: "perfil" as const, label: "Perfil" },
  ];

  return (
    <div className="pt-24 pb-20 px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-[1px] bg-neon/40" />
            <span className="text-[10px] font-mono uppercase tracking-[3px] text-neon/50">
              Panel
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-4xl md:text-5xl text-paper tracking-[1px] leading-none">
                Mi Cuenta
              </h1>
              <p className="mt-2 text-sm text-paper/30 font-body">
                {user.user_metadata?.full_name || user.email}
              </p>
            </div>
            <button
              onClick={signOut}
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-[10px] font-mono uppercase tracking-[2px] text-paper/30 border border-border/40 rounded-sm hover:text-neon hover:border-neon/30 transition-all duration-200"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-10">
          <div className="bg-smoke/50 border border-border/30 rounded-sm p-4 md:p-5">
            <span className="text-[9px] font-mono uppercase tracking-[2px] text-neon/50">Pedidos</span>
            <p className="mt-1.5 font-display text-xl md:text-3xl text-paper tracking-[1px] tabular-nums">
              {orders.length}
            </p>
            {pendingOrders > 0 && (
              <span className="text-[10px] font-mono text-yellow-400/60">{pendingOrders} pendientes</span>
            )}
          </div>
          <div className="bg-smoke/50 border border-border/30 rounded-sm p-4 md:p-5">
            <span className="text-[9px] font-mono uppercase tracking-[2px] text-neon/50">Gastado</span>
            <p className="mt-1.5 font-display text-xl md:text-3xl text-neon tracking-[1px] tabular-nums">
              ${totalSpent.toFixed(2)}
            </p>
          </div>
          <div className="bg-smoke/50 border border-border/30 rounded-sm p-4 md:p-5">
            <span className="text-[9px] font-mono uppercase tracking-[2px] text-neon/50">Carrito</span>
            <p className="mt-1.5 font-display text-xl md:text-3xl text-paper tracking-[1px] tabular-nums">
              {totalItems}
            </p>
            {totalItems > 0 && (
              <span className="text-[10px] font-mono text-paper/40">${totalPrice.toFixed(2)}</span>
            )}
          </div>
        </div>

        {/* Mobile Logout */}
        <button
          onClick={signOut}
          className="sm:hidden w-full mb-8 py-3 border border-border/40 text-paper/40 text-[10px] font-mono uppercase tracking-[2px] rounded-sm hover:text-neon hover:border-neon/30 transition-all"
        >
          Cerrar sesión
        </button>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-border/10 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 pb-3 text-[11px] font-mono uppercase tracking-[2px] transition-colors ${
                activeTab === tab.id
                  ? "text-neon"
                  : "text-paper/25 hover:text-paper/50"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-1.5 text-[10px] text-paper/20">({tab.count})</span>
              )}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-neon/60" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content: Pedidos */}
        {activeTab === "pedidos" && (
          <>
            {ordersLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-28 bg-smoke border border-border/50 animate-pulse rounded-sm" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 mb-6 rounded-full border border-border/30 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-paper/20">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <p className="text-paper/40 text-sm font-body mb-1">Todavía no tienes pedidos</p>
                <p className="text-paper/20 text-xs font-mono mb-6">Hacé tu primera compra en la tienda</p>
                <Link
                  href="/tienda"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-neon/30 text-neon text-[10px] font-mono uppercase tracking-[2px] rounded-sm hover:bg-neon/10 transition-all"
                >
                  Ir a la tienda
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const { date, time } = formatDate(order.created_at);
                  const status = statusConfig[order.status] || statusConfig.pending;
                  return (
                    <div
                      key={order.id}
                      className="group bg-smoke/30 border border-border/20 rounded-sm hover:border-border/40 transition-all duration-300"
                    >
                      {/* Order Header */}
                      <div className="flex items-center justify-between px-5 py-4 border-b border-border/10">
                        <div className="flex items-center gap-4">
                          <div className="w-9 h-9 rounded-full bg-neon/10 flex items-center justify-center flex-shrink-0">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-neon/60">
                              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs font-mono text-paper/40">
                              #{order.id.slice(0, 8).toUpperCase()}
                            </p>
                            <p className="text-[10px] font-mono text-paper/20 mt-0.5">
                              {date} · {time}
                            </p>
                          </div>
                        </div>
                        <span className={`text-[9px] font-mono uppercase tracking-[1px] px-2.5 py-1 rounded-sm border ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      {/* Order Items */}
                      <div className="px-5 py-3 space-y-2">
                        {order.items?.map((item) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <span className="text-xs text-paper/50 font-body truncate pr-4">
                              {item.product_name}
                              {item.variant_label && (
                                <span className="text-paper/20 ml-1">· {item.variant_label}</span>
                              )}
                              <span className="text-paper/20 ml-1">x{item.quantity}</span>
                            </span>
                            <span className="text-xs font-mono text-paper/60 tabular-nums flex-shrink-0">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                      {/* Order Footer */}
                      <div className="flex items-center justify-between px-5 py-3 border-t border-border/10 bg-smoke/20">
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-mono uppercase tracking-[1.5px] text-paper/25">
                            Total · {order.items?.length || 0} producto{(order.items?.length || 0) !== 1 ? "s" : ""}
                          </span>
                          {(order.status === "pending" || order.status === "confirmed") && (
                            <button
                              onClick={() => cancelOrder(order.id)}
                              disabled={cancelling === order.id}
                              className="text-[9px] font-mono uppercase tracking-[1px] text-red-400/60 hover:text-red-400 disabled:opacity-30 transition-colors"
                            >
                              {cancelling === order.id ? "..." : "Cancelar pedido"}
                            </button>
                          )}
                        </div>
                        <span className="font-display text-base md:text-lg text-neon tracking-[1px] tabular-nums">
                          ${Number(order.total).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Tab Content: Carrito */}
        {activeTab === "carrito" && (
          <>
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 mb-6 rounded-full border border-border/30 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-paper/20">
                    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                  </svg>
                </div>
                <p className="text-paper/40 text-sm font-body mb-1">Tu carrito está vacío</p>
                <p className="text-paper/20 text-xs font-mono mb-6">Agregá productos desde la tienda</p>
                <Link
                  href="/tienda"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-neon/30 text-neon text-[10px] font-mono uppercase tracking-[2px] rounded-sm hover:bg-neon/10 transition-all"
                >
                  Ir a la tienda
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.variant.id}
                    className="flex items-center gap-4 bg-smoke/30 border border-border/20 rounded-sm p-4 hover:border-border/40 transition-all duration-300"
                  >
                    {/* Product Image */}
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-surface border border-border/20 rounded-sm overflow-hidden flex-shrink-0 relative">
                      {item.product.images[0] ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-display text-xl text-neon/20">NS</span>
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/tienda/${item.product.slug}`}
                        className="text-sm font-body text-paper/70 hover:text-neon transition-colors truncate block"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-[10px] font-mono text-paper/25 mt-1">
                        {item.variant.size && <span>Talla {item.variant.size}</span>}
                        {item.variant.color && <span> · {item.variant.color}</span>}
                      </p>
                      <p className="text-xs font-mono text-neon/70 mt-1.5 tabular-nums">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    {/* Quantity */}
                    <div className="flex items-center border border-border/30 rounded-sm">
                      <button
                        onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-paper/30 hover:text-paper hover:bg-neon/10 transition-all"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                      </button>
                      <span className="w-8 text-center text-xs font-mono text-paper/70 tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-paper/30 hover:text-paper hover:bg-neon/10 transition-all"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                      </button>
                    </div>
                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.variant.id)}
                      className="w-8 h-8 flex items-center justify-center text-paper/15 hover:text-neon transition-colors flex-shrink-0"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ))}
                {/* Cart Total */}
                <div className="flex items-center justify-between bg-smoke/50 border border-border/20 rounded-sm px-5 py-4 mt-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[2px] text-paper/30">
                      Total del carrito
                    </span>
                    <p className="text-[10px] font-mono text-paper/15 mt-1">
                      {totalItems} producto{totalItems !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <span className="font-display text-xl md:text-2xl text-neon tracking-[1px] tabular-nums">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </>
        )}

        {/* Tab Content: Perfil */}
        {activeTab === "perfil" && (
          <div className="bg-smoke/30 border border-border/20 rounded-sm p-6 md:p-8">
            {/* Avatar */}
            <div className="flex items-center gap-5 mb-8 pb-8 border-b border-border/10">
              <div className="w-16 h-16 rounded-full bg-neon/10 flex items-center justify-center flex-shrink-0">
                <span className="font-display text-3xl text-neon">
                  {(user.email?.[0] || "U").toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="font-display text-xl md:text-2xl text-paper tracking-[1px]">
                  {profile.name || user.user_metadata?.full_name || "Usuario"}
                </h2>
                <p className="text-sm text-paper/40 font-body mt-1">{user.email}</p>
                <p className="text-[10px] font-mono text-paper/20 mt-2">
                  Miembro desde{" "}
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString("es-VE", {
                        year: "numeric", month: "long",
                      })
                    : "siempre"}
                </p>
              </div>
            </div>

            {profileLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-smoke border border-border/50 animate-pulse rounded-sm" />
                ))}
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); saveProfile(); }} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="text-[9px] font-mono uppercase tracking-[1.5px] text-paper/30 block mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Tu nombre"
                    className="w-full bg-surface border border-border/30 rounded-sm px-4 py-3 text-sm font-body text-paper placeholder-paper/15 outline-none focus:border-neon/40 transition-colors"
                  />
                </div>

                {/* Email (read-only) */}
                <div>
                  <label className="text-[9px] font-mono uppercase tracking-[1.5px] text-paper/30 block mb-2">
                    Email
                  </label>
                  <div className="w-full bg-surface/50 border border-border/20 rounded-sm px-4 py-3 text-sm font-body text-paper/40 cursor-not-allowed">
                    {user.email}
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="text-[9px] font-mono uppercase tracking-[1.5px] text-paper/30 block mb-2">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+58 412 123 4567"
                    className="w-full bg-surface border border-border/30 rounded-sm px-4 py-3 text-sm font-body text-paper placeholder-paper/15 outline-none focus:border-neon/40 transition-colors"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="text-[9px] font-mono uppercase tracking-[1.5px] text-paper/30 block mb-2">
                    Dirección de envío
                  </label>
                  <textarea
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    placeholder="Calle, ciudad, estado, código postal"
                    rows={3}
                    className="w-full bg-surface border border-border/30 rounded-sm px-4 py-3 text-sm font-body text-paper placeholder-paper/15 outline-none focus:border-neon/40 transition-colors resize-none"
                  />
                </div>

                {/* Save Button */}
                <div className="flex items-center gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-neon/10 border border-neon/30 text-neon text-[10px] font-mono uppercase tracking-[2px] rounded-sm hover:bg-neon/20 disabled:opacity-40 transition-all"
                  >
                    {saving ? "Guardando..." : "Guardar cambios"}
                  </button>
                  {saved && (
                    <span className="text-[10px] font-mono text-green-400/70 tracking-[1px]">
                      Guardado <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="inline -mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                  )}
                </div>
              </form>
            )}

            {/* Store Contact */}
            <div className="mt-8 pt-6 border-t border-border/10">
              <h3 className="text-[10px] font-mono uppercase tracking-[2px] text-neon/50 mb-4 flex items-center gap-2">
                <span className="w-3 h-[1px] bg-neon/30" />
                Contacto de la tienda
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-[1.5px] text-paper/20">WhatsApp</span>
                  <a
                    href={`https://wa.me/${STORE.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm font-body text-paper/60 mt-0.5 hover:text-neon transition-colors"
                  >
                    {STORE.phone}
                  </a>
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-[1.5px] text-paper/20">Email</span>
                  <p className="text-sm font-body text-paper/60 mt-0.5">{STORE.email}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
