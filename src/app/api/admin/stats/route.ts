import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-utils";

export async function GET() {
  const { user, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const supabase = await createServerSupabaseClient();

  const { count: totalProducts } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  const { count: totalOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  const { data: lowStockVariants } = await supabase
    .from("product_variants")
    .select("id, size, color, stock, product:products(id, name, slug)")
    .lt("stock", 5)
    .order("stock", { ascending: true });

  const lowStockCount = lowStockVariants?.length || 0;

  const firstOfMonth = new Date();
  firstOfMonth.setDate(1);
  firstOfMonth.setHours(0, 0, 0, 0);

  const { data: monthlyOrders } = await supabase
    .from("orders")
    .select("total")
    .gte("created_at", firstOfMonth.toISOString())
    .in("status", ["confirmed", "shipped", "delivered"]);

  const monthlyRevenue = monthlyOrders?.reduce((sum, o) => sum + Number(o.total), 0) || 0;

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: coupons } = await supabase
    .from("coupons")
    .select("id, active, used_count");

  const totalCoupons = coupons?.length || 0;
  const activeCoupons = coupons?.filter((c) => c.active).length || 0;
  const totalCouponUses = coupons?.reduce((sum, c) => sum + (c.used_count || 0), 0) || 0;

  const { data: topProducts } = await supabase
    .from("order_items")
    .select("product_id, product_name, quantity")
    .limit(100);

  const productSales: Record<string, { name: string; qty: number }> = {};
  for (const item of topProducts || []) {
    if (!productSales[item.product_id]) {
      productSales[item.product_id] = { name: item.product_name, qty: 0 };
    }
    productSales[item.product_id].qty += item.quantity;
  }
  const topSelling = Object.entries(productSales)
    .map(([id, data]) => ({ id, name: data.name, qty: data.qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  const dailyRevenue: { date: string; total: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const end = new Date(d);
    end.setHours(23, 59, 59, 999);

    const { data: dayOrders } = await supabase
      .from("orders")
      .select("total")
      .gte("created_at", d.toISOString())
      .lte("created_at", end.toISOString())
      .in("status", ["confirmed", "shipped", "delivered"]);

    const dayTotal = dayOrders?.reduce((sum, o) => sum + Number(o.total), 0) || 0;
    dailyRevenue.push({
      date: d.toLocaleDateString("es-VE", { weekday: "short", day: "numeric" }),
      total: dayTotal,
    });
  }

  const { data: ordersByStatus } = await supabase
    .from("orders")
    .select("status");

  const statusCounts: Record<string, number> = {};
  for (const o of ordersByStatus || []) {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  }

  return NextResponse.json({
    totalProducts: totalProducts || 0,
    totalOrders: totalOrders || 0,
    monthlyRevenue,
    lowStockCount,
    lowStockVariants: lowStockVariants || [],
    recentOrders: recentOrders || [],
    totalCoupons,
    activeCoupons,
    totalCouponUses,
    topSelling,
    dailyRevenue,
    ordersByStatus: statusCounts,
  });
}
