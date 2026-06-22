"use client";

import { createContext, useContext, useCallback, useMemo } from "react";
import type { CartItem, Product, ProductVariant } from "@/types";
import { useCartStore } from "@/lib/cart-store";
import { useToastStore } from "@/lib/stores/toast-store";

type CartContextType = {
  items: CartItem[];
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useCartStore((s) => s.items);
  const addToCart = useCartStore((s) => s.addItem);
  const removeFromCart = useCartStore((s) => s.removeItem);
  const updateCartQty = useCartStore((s) => s.updateQuantity);
  const emptyCart = useCartStore((s) => s.clearCart);

  const addToast = useToastStore((s) => s.addToast);

  const addItem = useCallback(
    (product: Product, variant: ProductVariant, quantity = 1) => {
      addToCart(product, variant, quantity);
      addToast(`${product.name} — agregado al carrito`, "success");
    },
    [addToCart, addToast]
  );

  const removeItem = useCallback(
    (variantId: string) => removeFromCart(variantId),
    [removeFromCart]
  );

  const updateQuantity = useCallback(
    (variantId: string, quantity: number) => updateCartQty(variantId, quantity),
    [updateCartQty]
  );

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart: emptyCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
