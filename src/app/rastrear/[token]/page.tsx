import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

type Props = { params: Promise<{ token: string }> };

export const metadata: Metadata = {
  title: "Rastrear Pedido | NORTE SUR",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  processing: "En proceso",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

const STATUS_STEPS = ["pending", "confirmed", "processing", "shipped", "delivered"];

export default async function TrackingPage({ params }: Props) {
  const { token } = await params;

  const supabase = await createServerSupabaseClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("tracking_token", token)
    .single();

  if (!order) {
    redirect("/tienda");
  }

  const currentStep = STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <div className="pt-24 pb-16 px-6 min-h-screen">
      <div className="max-w-[800px] mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <h1 className="font-display text-3xl text-offwhite tracking-[2px]">
            Rastrear <span className="text-gold">Pedido</span>
          </h1>
        </div>

        <div className="bg-surface border border-border rounded-sm p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[1.5px] text-offwhite/40 mb-1">
                Pedido #{order.id.slice(0, 8)}
              </p>
              <p className="text-xs font-mono text-offwhite/30">
                {new Date(order.created_at).toLocaleDateString("es-ES", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </p>
            </div>
            <div className="px-4 py-2 rounded-sm text-sm font-mono uppercase tracking-[1.5px] bg-gold/10 text-gold border border-gold/20">
              {isCancelled ? "Cancelado" : STATUS_LABELS[order.status] || order.status}
            </div>
          </div>

          {!isCancelled && (
            <div className="mb-10">
              <div className="flex items-center justify-between relative">
                {STATUS_STEPS.map((step, i) => {
                  const done = i <= currentStep;
                  const isLast = i === STATUS_STEPS.length - 1;
                  return (
                    <div key={step} className="flex items-center flex-1 relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono z-10 transition-all ${
                        done ? "bg-gold text-black" : "bg-surface-light text-offwhite/30 border border-border"
                      }`}>
                        {done
  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  : i + 1
}
                      </div>
                      {!isLast && (
                        <div className={`flex-1 h-[1px] mx-2 ${i < currentStep ? "bg-gold/50" : "bg-border"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-2">
                {STATUS_STEPS.map((step) => (
                  <span key={step} className="text-[9px] font-mono uppercase tracking-[1px] text-offwhite/30">
                    {STATUS_LABELS[step]}
                  </span>
                ))}
              </div>
            </div>
          )}

          {isCancelled && (
            <div className="mb-8 p-4 bg-accent/5 border border-accent/20 rounded-sm">
              <p className="text-sm font-mono text-accent">Este pedido fue cancelado.</p>
            </div>
          )}

          <div className="border-t border-border pt-6">
            <h3 className="text-xs font-mono uppercase tracking-[2px] text-gold mb-4">
              Productos
            </h3>
            <div className="space-y-3">
              {order.order_items.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm font-body text-offwhite">{item.product_name}</p>
                    <p className="text-[10px] font-mono text-offwhite/30">{item.variant_label} x{item.quantity}</p>
                  </div>
                  <p className="text-sm font-mono text-offwhite/60">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-4 mt-2 border-t border-border">
              <span className="text-sm text-offwhite/60 font-body">Total</span>
              <span className="font-display text-2xl text-gold tracking-[1px]">${order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <p className="uppercase tracking-[1.5px] text-offwhite/40 mb-1">Cliente</p>
              <p className="text-offwhite/80">{order.customer_name}</p>
            </div>
            <div>
              <p className="uppercase tracking-[1.5px] text-offwhite/40 mb-1">Dirección</p>
              <p className="text-offwhite/80">{order.customer_address}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/tienda" className="text-xs font-mono uppercase tracking-[2px] text-gold hover:text-gold-light transition-colors">
            Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  );
}
