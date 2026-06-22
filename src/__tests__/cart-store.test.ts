import { describe, it, expect, beforeEach } from "@jest/globals";
import { useCartStore } from "@/lib/cart-store";
import type { Product, ProductVariant } from "@/types";

const mockProduct: Product = {
  id: "1",
  name: "Camisa Test",
  slug: "camisa-test",
  description: "Descripción",
  price: 25,
  category_id: "cat1",
  images: ["/test.jpg"],
  featured: false,
  active: true,
  variants: [],
  created_at: new Date().toISOString(),
};

const mockVariant: ProductVariant = {
  id: "v1",
  product_id: "1",
  size: "M",
  color: "Negro",
  stock: 10,
  sku: "CAM-M-NEG",
};

describe("CartStore", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it("should start with an empty cart", () => {
    const { items } = useCartStore.getState();
    expect(items).toEqual([]);
  });

  it("should add an item to the cart", () => {
    useCartStore.getState().addItem(mockProduct, mockVariant);
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].variant.id).toBe("v1");
    expect(items[0].quantity).toBe(1);
  });

  it("should increase quantity if item already exists", () => {
    useCartStore.getState().addItem(mockProduct, mockVariant);
    useCartStore.getState().addItem(mockProduct, mockVariant, 2);
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(3);
  });

  it("should remove an item from the cart", () => {
    useCartStore.getState().addItem(mockProduct, mockVariant);
    useCartStore.getState().removeItem("v1");
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(0);
  });

  it("should update quantity of an item", () => {
    useCartStore.getState().addItem(mockProduct, mockVariant);
    useCartStore.getState().updateQuantity("v1", 5);
    const { items } = useCartStore.getState();
    expect(items[0].quantity).toBe(5);
  });

  it("should remove item when quantity is set to 0", () => {
    useCartStore.getState().addItem(mockProduct, mockVariant);
    useCartStore.getState().updateQuantity("v1", 0);
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(0);
  });

  it("should clear the entire cart", () => {
    useCartStore.getState().addItem(mockProduct, mockVariant);
    useCartStore.getState().clearCart();
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(0);
  });
});
