"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

type DashboardStats = {
  totalProducts: number;
  totalOrders: number;
  monthlyRevenue: number;
  lowStockCount: number;
  lowStockVariants: { id: string; size: string; color: string; stock: number; product: { id: string; name: string; slug: string } }[];
  recentOrders: any[];
  totalCoupons: number;
  activeCoupons: number;
  totalCouponUses: number;
  topSelling: { id: string; name: string; qty: number }[];
  dailyRevenue: { date: string; total: number }[];
  ordersByStatus: Record<string, number>;
};

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendientes", color: "bg-yellow-500" },
  confirmed: { label: "Confirmadas", color: "bg-blue-500" },
  shipped: { label: "Enviadas", color: "bg-purple-500" },
  delivered: { label: "Entregadas", color: "bg-green-500" },
  cancelled: { label: "Canceladas", color: "bg-red-500" },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats(data);
    } catch {} finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  const refresh = () => {
    setRefreshing(true);
    loadStats();
  };

  const maxRevenue = Math.max(...(stats?.dailyRevenue.map((d) => d.total) || [1]), 1);

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[2.5px] text-neon">Admin</span>
            <h1 className="mt-2 font-display text-4xl md:text-5xl text-paper tracking-[2px]">
              Panel de <span className="text-neon">Control</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refresh}
              disabled={refreshing}
              className="text-[10px] font-mono uppercase tracking-[1.5px] text-paper/30 hover:text-paper/60 transition-colors disabled:opacity-30"
            >
              {refreshing ? "Actualizando..." : "↻ Actualizar"}
            </button>
            <Link
              href="/"
              className="text-xs font-mono uppercase tracking-[1.5px] text-paper/30 hover:text-paper/60 transition-colors"
            >
              Ver tienda →
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="space-y-12">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="p-6 bg-smoke border border-border rounded-sm">
                  <div className="h-8 w-20 bg-smoke border border-border/50 animate-pulse rounded" />
                  <div className="h-3 w-24 bg-smoke border border-border/50 animate-pulse rounded mt-3" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
              <Link
                href="/admin/productos"
                className="p-6 bg-smoke border border-border rounded-sm hover:border-neon/30 transition-all group"
              >
                <p className="font-display text-3xl md:text-4xl text-neon tracking-[1px]">{stats?.totalProducts ?? "--"}</p>
                <p className="mt-2 text-[10px] text-paper/40 font-mono uppercase tracking-[1.5px]">Productos</p>
              </Link>
              <Link
                href="/admin/ordenes"
                className="p-6 bg-smoke border border-border rounded-sm hover:border-neon/30 transition-all group"
              >
                <p className="font-display text-3xl md:text-4xl text-neon tracking-[1px]">{stats?.totalOrders ?? "--"}</p>
                <p className="mt-2 text-[10px] text-paper/40 font-mono uppercase tracking-[1.5px]">Órdenes</p>
              </Link>
              <Link
                href="/admin/ordenes"
                className="p-6 bg-smoke border border-border rounded-sm hover:border-neon/30 transition-all group"
              >
                <p className="font-display text-3xl md:text-4xl text-neon tracking-[1px]">${Number(stats?.monthlyRevenue ?? 0).toFixed(0)}</p>
                <p className="mt-2 text-[10px] text-paper/40 font-mono uppercase tracking-[1.5px]">Ingresos (mes)</p>
              </Link>
              <Link
                href="/admin/inventario"
                className={`p-6 bg-smoke border rounded-sm transition-all group ${(stats?.lowStockCount ?? 0) > 0 ? "border-accent/40" : "border-border hover:border-neon/30"}`}
              >
                <p className="font-display text-3xl md:text-4xl text-neon tracking-[1px]">{stats?.lowStockCount ?? "--"}</p>
                <p className="mt-2 text-[10px] text-paper/40 font-mono uppercase tracking-[1.5px]">Stock bajo</p>
              </Link>
              <Link
                href="/admin/cupones"
                className="p-6 bg-smoke border border-border rounded-sm hover:border-neon/30 transition-all group"
              >
                <p className="font-display text-3xl md:text-4xl text-neon tracking-[1px]">{stats?.activeCoupons ?? "--"} <span className="text-xs text-paper/30">/ {stats?.totalCoupons ?? 0}</span></p>
                <p className="mt-2 text-[10px] text-paper/40 font-mono uppercase tracking-[1.5px]">Cupones activos</p>
              </Link>
              <Link
                href="/admin/cupones"
                className="p-6 bg-smoke border border-border rounded-sm hover:border-neon/30 transition-all group"
              >
                <p className="font-display text-3xl md:text-4xl text-neon tracking-[1px]">{stats?.totalCouponUses ?? "--"}</p>
                <p className="mt-2 text-[10px] text-paper/40 font-mono uppercase tracking-[1.5px]">Usos de cupones</p>
              </Link>
            </div>

            {/* Revenue Chart + Order Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
              {/* Revenue Chart */}
              <div className="lg:col-span-2 bg-smoke border border-border rounded-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl text-paper tracking-[1px]">Ingresos (7 días)</h2>
                  <span className="text-[10px] font-mono text-paper/20 tracking-[1px]">${Number(stats?.monthlyRevenue ?? 0).toFixed(0)} este mes</span>
                </div>
                <div className="flex items-end gap-3 h-40">
                  {stats?.dailyRevenue.map((day) => (
                    <div key={day.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <span className="text-[9px] font-mono text-neon/60 tabular-nums">${day.total.toFixed(0)}</span>
                      <div
                        className="w-full bg-neon/20 rounded-t-sm hover:bg-neon/30 transition-all"
                        style={{ height: `${Math.max((day.total / maxRevenue) * 100, 4)}%` }}
                      />
                      <span className="text-[8px] font-mono text-paper/20 uppercase tracking-[0.5px] mt-1">{day.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Status */}
              <div className="bg-smoke border border-border rounded-sm p-6">
                <h2 className="font-display text-xl text-paper tracking-[1px] mb-6">Órdenes por Estado</h2>
                <div className="space-y-4">
                  {Object.entries(statusLabels).map(([key, config]) => {
                    const count = stats?.ordersByStatus[key] || 0;
                    const total = Object.values(stats?.ordersByStatus || {}).reduce((s, v) => s + v, 0) || 1;
                    const pct = (count / total) * 100;
                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${config.color}`} />
                            <span className="text-[10px] font-mono uppercase tracking-[1px] text-paper/40">{config.label}</span>
                          </div>
                          <span className="text-xs font-mono text-paper/60 tabular-nums">
                            {count} <span className="text-paper/20">({pct.toFixed(0)}%)</span>
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-smoke rounded-full overflow-hidden">
                          <div className={`h-full ${config.color} rounded-full transition-all duration-300`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Grid: Top Products + Low Stock */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              {/* Top Selling Products */}
              <div className="bg-smoke border border-border rounded-sm p-6">
                <h2 className="font-display text-xl text-paper tracking-[1px] mb-6">Productos más vendidos</h2>
                {stats?.topSelling && stats.topSelling.length > 0 ? (
                  <div className="space-y-4">
                    {(stats.topSelling as { id: string; name: string; qty: number }[]).map((product, i) => {
                      const maxQty = stats.topSelling[0]?.qty || 1;
                      const pct = (product.qty / maxQty) * 100;
                      return (
                        <div key={product.id}>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-[10px] font-mono text-paper/20 w-4">{i + 1}.</span>
                              <span className="text-xs text-paper/70 truncate">{product.name}</span>
                            </div>
                            <span className="text-xs font-mono text-neon/60 tabular-nums ml-2">{product.qty} vend.</span>
                          </div>
                          <div className="w-full h-1.5 bg-smoke rounded-full overflow-hidden">
                            <div className="h-full bg-neon/40 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-paper/30 text-center py-8">Sin ventas todavía</p>
                )}
              </div>

              {/* Low Stock */}
              <div className="bg-smoke border border-border rounded-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl text-paper tracking-[1px]">Stock bajo</h2>
                  <Link
                    href="/admin/inventario"
                    className="text-[10px] font-mono uppercase tracking-[1.5px] text-neon hover:text-neon-dim transition-colors"
                  >
                    Ver inventario →
                  </Link>
                </div>
                {stats?.lowStockVariants && stats.lowStockVariants.length > 0 ? (
                  <div className="space-y-3">
                    {(stats.lowStockVariants as { id: string; size: string; color: string; stock: number; product: { id: string; name: string; slug: string } }[]).map((v) => (
                      <Link
                        key={v.id}
                        href={`/tienda/${v.product.slug}`}
                        className="flex items-center justify-between p-3 bg-smoke/50 border border-border/30 rounded-sm hover:border-accent/30 transition-all group"
                      >
                        <div className="min-w-0">
                          <p className="text-xs text-paper/70 truncate group-hover:text-neon transition-colors">{v.product.name}</p>
                          <p className="text-[10px] font-mono text-paper/30 mt-0.5">
                            {v.size && <span>{v.size}</span>}
                            {v.color && <span> · {v.color}</span>}
                          </p>
                        </div>
                        <span className={`text-xs font-mono tabular-nums ml-3 ${v.stock === 0 ? "text-red-400" : "text-yellow-400"}`}>
                          {v.stock === 0 ? "Agotado" : `${v.stock} uds.`}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-paper/30 text-center py-8">Todo en stock</p>
                )}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-smoke border border-border rounded-sm overflow-hidden">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="font-display text-xl text-paper tracking-[1px]">Órdenes Recientes</h2>
                <Link
                  href="/admin/ordenes"
                  className="text-xs font-mono uppercase tracking-[1.5px] text-neon hover:text-neon-dim transition-colors"
                >
                  Ver todas →
                </Link>
              </div>
              {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-[10px] font-mono uppercase tracking-[1.5px] text-paper/30">
                        <th className="p-4 font-normal">Cliente</th>
                        <th className="p-4 font-normal">Total</th>
                        <th className="p-4 font-normal">Estado</th>
                        <th className="p-4 font-normal">Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders.map((order: any) => (
                        <tr key={order.id} className="border-b border-border/50 last:border-0">
                          <td className="p-4 text-paper/70">{order.customer_name}</td>
                          <td className="p-4 text-paper/70">${Number(order.total).toFixed(2)}</td>
                          <td className="p-4">
                            <span
                              className={`text-[10px] font-mono uppercase tracking-[1px] px-2 py-1 rounded-sm ${
                                order.status === "pending"
                                  ? "bg-yellow-500/10 text-yellow-400"
                                  : order.status === "confirmed"
                                    ? "bg-blue-500/10 text-blue-400"
                                    : order.status === "shipped"
                                      ? "bg-purple-500/10 text-purple-400"
                                      : order.status === "delivered"
                                        ? "bg-green-500/10 text-green-400"
                                        : "bg-red-500/10 text-red-400"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="p-4 text-paper/40 text-xs">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-paper/30 text-sm">No hay órdenes recientes</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
