"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

type OrderItem = {
  id: string;
  product_name: string;
  variant_label: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total: number;
  status: string;
  created_at: string;
  items: OrderItem[];
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  shipped: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  delivered: "bg-green-500/10 text-green-400 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

const statusFlow = ["pending", "confirmed", "shipped", "delivered"];

export default function AdminOrdenes() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setUpdating(null);
    fetchOrders();
  };

  const pendingCount = orders.filter((o) => o.status === "pending").length;

  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === "visible") fetchOrders(); };
    document.addEventListener("visibilitychange", onVisible);
    const interval = setInterval(fetchOrders, 30000);
    return () => { document.removeEventListener("visibilitychange", onVisible); clearInterval(interval); };
  }, [fetchOrders]);

  const filtered = filter
    ? orders.filter((o) => o.status === filter)
    : orders;

  const nextStatus = (current: string): string | null => {
    if (current === "cancelled" || current === "delivered") return null;
    const idx = statusFlow.indexOf(current);
    return idx < statusFlow.length - 1 ? statusFlow[idx + 1] : null;
  };

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[2.5px] text-neon">
              Admin / Ordenes
            </span>
            <h1 className="mt-2 font-display text-4xl md:text-5xl text-paper tracking-[2px]">
              Gestion de <span className="text-neon">Ordenes</span>
            </h1>
          </div>
          <div className="flex gap-2">
            {["", "pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`text-[10px] font-mono uppercase tracking-[1px] px-3 py-1.5 rounded-sm border transition-all ${
                  filter === s
                    ? "bg-neon/10 text-neon border-neon/30"
                    : "border-border text-paper/30 hover:text-paper/50"
                }`}
              >
                {s || "Todas"}
              </button>
            ))}
          </div>
        </div>

        {pendingCount > 0 && (
          <div className="mb-6 flex items-center gap-3 px-5 py-3 bg-yellow-500/5 border border-yellow-500/20 rounded-sm">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <p className="text-xs font-mono text-yellow-400/80">
              {pendingCount} {pendingCount === 1 ? "orden pendiente" : "órdenes pendientes"} — revisa las nuevas órdenes
            </p>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-smoke border border-border/50 animate-pulse rounded-sm" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 bg-smoke border border-border rounded-sm text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neon/10 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neon">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <p className="text-paper/40 text-sm">No hay ordenes {filter ? `con estado "${filter}"` : "aun"}.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => (
              <div
                key={order.id}
                className="bg-smoke border border-border rounded-sm overflow-hidden"
              >
                <button
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                  className="w-full p-5 flex items-center justify-between text-left hover:bg-smoke/30 transition-colors"
                >
                  <div className="flex items-center gap-6 flex-wrap">
                    <div>
                      <p className="text-paper/80 text-sm font-medium">{order.customer_name}</p>
                      <p className="text-[10px] text-paper/30 font-mono mt-0.5">
                        {new Date(order.created_at).toLocaleDateString()}{" "}
                        {new Date(order.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-mono uppercase tracking-[1px] px-2.5 py-1 rounded-sm border ${statusColors[order.status] || statusColors.pending}`}
                    >
                      {order.status}
                    </span>
                    <span className="text-sm text-paper/70 font-display tracking-[1px]">
                      ${Number(order.total).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {nextStatus(order.status) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(order.id, nextStatus(order.status)!);
                        }}
                        disabled={updating === order.id}
                        className="text-[10px] font-mono uppercase tracking-[1px] px-3 py-1.5 bg-neon/10 text-neon border border-neon/20 rounded-sm hover:bg-neon/20 disabled:opacity-30 transition-all whitespace-nowrap"
                      >
                        {updating === order.id ? "..." : `→ ${nextStatus(order.status)}`}
                      </button>
                    )}
                    {order.status !== "cancelled" && order.status !== "delivered" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(order.id, "cancelled");
                        }}
                        disabled={updating === order.id}
                        className="text-[10px] font-mono uppercase tracking-[1px] px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-sm hover:bg-red-500/20 disabled:opacity-30 transition-all whitespace-nowrap"
                      >
                        Cancelar
                      </button>
                    )}
                    <span className="text-paper/20 text-sm">
                      {expanded === order.id
  ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline"><polyline points="18 15 12 9 6 15"/></svg>
  : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline"><polyline points="6 9 12 15 18 9"/></svg>
}
                    </span>
                  </div>
                </button>

                {expanded === order.id && (
                  <div className="px-5 pb-5 pt-0 border-t border-border/50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 mb-4">
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-[1.5px] text-paper/30 mb-1">
                          Telefono
                        </p>
                        <p className="text-sm text-paper/70">{order.customer_phone}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-[10px] font-mono uppercase tracking-[1.5px] text-paper/30 mb-1">
                          Direccion
                        </p>
                        <p className="text-sm text-paper/70">{order.customer_address}</p>
                      </div>
                    </div>

                    <div className="bg-smoke rounded-sm overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border text-left text-[10px] font-mono uppercase tracking-[1.5px] text-paper/30">
                            <th className="p-3 font-normal">Producto</th>
                            <th className="p-3 font-normal">Variante</th>
                            <th className="p-3 font-normal">Cant</th>
                            <th className="p-3 font-normal">Precio</th>
                            <th className="p-3 font-normal text-right">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item) => (
                            <tr key={item.id} className="border-b border-border/30 last:border-0">
                              <td className="p-3 text-paper/70">{item.product_name}</td>
                              <td className="p-3">
                                <span className="text-[10px] font-mono uppercase tracking-[1px] px-2 py-0.5 bg-smoke border border-border rounded-sm text-paper/50">
                                  {item.variant_label || "—"}
                                </span>
                              </td>
                              <td className="p-3 text-paper/70">{item.quantity}</td>
                              <td className="p-3 text-paper/70">${Number(item.price).toFixed(2)}</td>
                              <td className="p-3 text-paper/80 text-right">
                                ${(item.quantity * Number(item.price)).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
