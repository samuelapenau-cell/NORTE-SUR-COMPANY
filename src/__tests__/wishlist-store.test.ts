import { describe, it, expect, beforeEach } from "@jest/globals";
import { useWishlist } from "@/lib/stores/wishlist-store";

const mockItem = {
  id: "1",
  name: "Camisa Test",
  slug: "camisa-test",
  price: 25,
  image: "/test.jpg",
};

describe("WishlistStore", () => {
  beforeEach(() => {
    useWishlist.setState({ items: [] });
  });

  it("should start empty", () => {
    expect(useWishlist.getState().items).toEqual([]);
  });

  it("should add an item", () => {
    useWishlist.getState().addItem(mockItem);
    expect(useWishlist.getState().items).toHaveLength(1);
  });

  it("should not add duplicate items", () => {
    useWishlist.getState().addItem(mockItem);
    useWishlist.getState().addItem(mockItem);
    expect(useWishlist.getState().items).toHaveLength(1);
  });

  it("should remove an item", () => {
    useWishlist.getState().addItem(mockItem);
    useWishlist.getState().removeItem("1");
    expect(useWishlist.getState().items).toHaveLength(0);
  });

  it("should check if item is wishlisted", () => {
    expect(useWishlist.getState().isWishlisted("1")).toBe(false);
    useWishlist.getState().addItem(mockItem);
    expect(useWishlist.getState().isWishlisted("1")).toBe(true);
  });

  it("should toggle item on/off", () => {
    useWishlist.getState().toggleItem(mockItem);
    expect(useWishlist.getState().isWishlisted("1")).toBe(true);
    useWishlist.getState().toggleItem(mockItem);
    expect(useWishlist.getState().isWishlisted("1")).toBe(false);
  });

  it("should clear all items", () => {
    useWishlist.getState().addItem(mockItem);
    useWishlist.getState().clearWishlist();
    expect(useWishlist.getState().items).toHaveLength(0);
  });
});
