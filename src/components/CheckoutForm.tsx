"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { STORE } from "@/lib/constants";
import { sanitizeInput, validatePhone, validateName, validateAddress } from "@/lib/sanitize";
import type { CartItem } from "@/types";

type CheckoutFormProps = {
  onBack: () => void;
};

type FieldErrors = {
  name?: string;
  phone?: string;
  address?: string;
};

export function CheckoutForm({ onBack }: CheckoutFormProps) {
  const { items, totalPrice, clearCart } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [trackingUrl, setTrackingUrl] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponApplying, setCouponApplying] = useState(false);

  const finalTotal = Math.max(0, totalPrice - couponDiscount);

  const validate = (): boolean => {
    const errs: FieldErrors = {};
    const nameResult = validateName(name);
    if (!nameResult.valid) errs.name = nameResult.error;
    const phoneResult = validatePhone(phone);
    if (!phoneResult.valid) errs.phone = phoneResult.error;
    const addrResult = validateAddress(address);
    if (!addrResult.valid) errs.address = addrResult.error;
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponApplying(true);
    setCouponError("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: sanitizeInput(couponCode), total: totalPrice }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setCouponDiscount(data.coupon.discount);
        setCouponError("");
      } else {
        setCouponDiscount(0);
        setCouponError(data.error || "Cupón inválido");
      }
    } catch {
      setCouponError("Error al validar cupón");
    } finally {
      setCouponApplying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const sanitizedName = sanitizeInput(name);
    const sanitizedPhone = sanitizeInput(phone);
    const sanitizedAddress = sanitizeInput(address);

    setSubmitting(true);
    setError("");

    const orderItems = items.map((i: CartItem) => ({
      product_id: i.product.id,
      variant_id: i.variant.id,
      product_name: sanitizeInput(i.product.name),
      variant_label: sanitizeInput(`${i.variant.size} / ${i.variant.color}`),
      quantity: i.quantity,
      price: i.product.price,
    }));

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: sanitizedName,
          customer_phone: sanitizedPhone,
          customer_address: sanitizedAddress,
          items: orderItems,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al crear la orden");
      }

      const data = await res.json();

      const whatsappMessage = items
        .map(
          (i) =>
            `• ${i.product.name} (${i.variant.size}, ${i.variant.color}) x${i.quantity} = $${(i.product.price * i.quantity).toFixed(2)}`
        )
        .join("\n");

      const discountLine = couponDiscount > 0
        ? `\nDescuento: -$${couponDiscount.toFixed(2)}\nTotal final: $${finalTotal.toFixed(2)}`
        : `\nTotal: $${totalPrice.toFixed(2)}`;

      const checkoutUrl = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(
        `¡Hola! Quiero confirmar mi pedido:\n\n${whatsappMessage}${discountLine}\n\nMis datos:\nNombre: ${sanitizedName}\nTeléfono: ${sanitizedPhone}\nDirección: ${sanitizedAddress}\n\nQuedo atento a la confirmación.`
      )}`;

      if (data.tracking_url) setTrackingUrl(data.tracking_url);
      clearCart();
      window.open(checkoutUrl, "_blank");
    } catch (err: any) {
      setError(err.message || "Error al procesar el pedido");
    } finally {
      setSubmitting(false);
    }
  };

  if (trackingUrl) {
    return (
      <div className="px-6 py-8 flex flex-col items-center gap-4 text-center">
        <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="font-display text-xl text-offwhite tracking-[1px]">Pedido <span className="text-gold">enviado</span></h3>
        <p className="text-xs text-offwhite/50 font-mono">Te redirigimos a WhatsApp para confirmar.</p>
        <a href={trackingUrl} className="mt-2 text-xs font-mono uppercase tracking-[2px] text-gold hover:text-gold-light transition-colors">Rastrear pedido</a>
        <button onClick={onBack} className="mt-2 text-[10px] font-mono uppercase tracking-[1.5px] text-offwhite/30 hover:text-offwhite/50 transition-colors">Volver al carrito</button>
      </div>
    );
  }

  const inputClass = (hasError: boolean) =>
    `w-full px-3 py-2.5 bg-surface border rounded-sm text-sm text-offwhite/80 placeholder:text-offwhite/20 focus:outline-none focus:border-gold/50 transition-colors ${
      hasError ? "border-accent/60" : "border-border"
    }`;

  return (
    <form onSubmit={handleSubmit} className="px-6 py-4 flex flex-col gap-4">
      <h3 className="font-display text-lg text-offwhite tracking-[1px] mb-2">Datos de <span className="text-gold">envío</span></h3>

      {error && (
        <p className="text-xs font-mono text-accent bg-accent/10 px-3 py-2 rounded-sm">{error}</p>
      )}

      <div>
        <label className="block text-[10px] font-mono uppercase tracking-[1.5px] text-offwhite/40 mb-1">Nombre completo</label>
        <input
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined })); }}
          placeholder="Tu nombre"
          maxLength={200}
          autoComplete="name"
          className={inputClass(!!fieldErrors.name)}
          aria-invalid={!!fieldErrors.name}
          aria-describedby={fieldErrors.name ? "name-error" : undefined}
        />
        {fieldErrors.name && <p id="name-error" className="mt-1 text-[10px] font-mono text-accent">{fieldErrors.name}</p>}
      </div>

      <div>
        <label className="block text-[10px] font-mono uppercase tracking-[1.5px] text-offwhite/40 mb-1">Teléfono / WhatsApp</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => { setPhone(e.target.value); if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: undefined })); }}
          placeholder="0412-XXXXXXX"
          maxLength={15}
          autoComplete="tel"
          className={inputClass(!!fieldErrors.phone)}
          aria-invalid={!!fieldErrors.phone}
          aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
        />
        {fieldErrors.phone && <p id="phone-error" className="mt-1 text-[10px] font-mono text-accent">{fieldErrors.phone}</p>}
      </div>

      <div>
        <label className="block text-[10px] font-mono uppercase tracking-[1.5px] text-offwhite/40 mb-1">Dirección de entrega</label>
        <textarea
          value={address}
          onChange={(e) => { setAddress(e.target.value); if (fieldErrors.address) setFieldErrors((prev) => ({ ...prev, address: undefined })); }}
          placeholder="Ciudad, sector, calle, casa #..."
          rows={2}
          maxLength={300}
          autoComplete="street-address"
          className={inputClass(!!fieldErrors.address) + " resize-none"}
          aria-invalid={!!fieldErrors.address}
          aria-describedby={fieldErrors.address ? "address-error" : undefined}
        />
        {fieldErrors.address && <p id="address-error" className="mt-1 text-[10px] font-mono text-accent">{fieldErrors.address}</p>}
      </div>

      <div className="pt-2 border-t border-border space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => { setCouponCode(e.target.value); setCouponDiscount(0); }}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyCoupon())}
            placeholder="Cupón de descuento"
            maxLength={30}
            className="flex-1 px-3 py-2 bg-surface-light border border-border rounded-sm text-xs text-offwhite/80 placeholder:text-offwhite/20 focus:outline-none focus:border-gold/50 font-mono"
          />
          <button
            type="button"
            onClick={applyCoupon}
            disabled={couponApplying || !couponCode.trim()}
            className="px-4 py-2 bg-gold/10 border border-gold/20 text-gold text-[10px] font-mono uppercase tracking-[1.5px] rounded-sm hover:bg-gold/20 disabled:opacity-30 transition-all"
          >
            {couponApplying ? "..." : "Aplicar"}
          </button>
        </div>
        {couponError && <p className="text-[10px] font-mono text-accent">{couponError}</p>}
        {couponDiscount > 0 && (
          <p className="text-[10px] font-mono text-green-400">Descuento: -${couponDiscount.toFixed(2)}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-sm text-offwhite/60 font-body">Total</span>
          <span className="font-display text-2xl text-gold tracking-[1px]">${finalTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={onBack} className="flex-1 py-3 border border-border text-offwhite/50 hover:text-offwhite/70 font-mono text-xs uppercase tracking-[2px] rounded-sm transition-colors">
          Volver
        </button>
        <button type="submit" disabled={submitting} className="flex-[2] py-3 bg-gold text-black font-display text-base tracking-[2px] rounded-sm hover:bg-gold-light disabled:opacity-40 transition-all duration-300 active:scale-[0.98]">
          {submitting ? "Procesando..." : "Confirmar pedido"}
        </button>
      </div>

      <p className="text-[10px] text-offwhite/30 text-center font-mono">Te redirigiremos a WhatsApp para confirmar</p>
    </form>
  );
}
