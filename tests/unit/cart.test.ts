import { describe, expect, it } from "vitest";
import { addItem, cartCount, cartSubtotal, clampQuantity, parseStoredCart, removeItem, setItemQuantity } from "@/lib/cart";
import type { CartItem, Product } from "@/types";

const product = (overrides: Partial<Product> = {}): Product => ({
  id: "p1",
  name: "Necklace",
  price: 55,
  imageUrl: "https://picsum.photos/seed/x/10/10",
  description: "",
  stock: 5,
  category: "Jewelry",
  ...overrides,
});

describe("cart operations", () => {
  it("adds a new item with the requested quantity", () => {
    const items = addItem([], product(), 3);
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(3);
  });

  it("merges quantities for an existing item", () => {
    const items = addItem(addItem([], product(), 2), product(), 2);
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(4);
  });

  it("never exceeds available stock", () => {
    const items = addItem(addItem([], product({ stock: 3 }), 2), product({ stock: 3 }), 5);
    expect(items[0].quantity).toBe(3);
  });

  it("ignores sold-out products and non-positive quantities", () => {
    expect(addItem([], product({ stock: 0 }))).toEqual([]);
    expect(addItem([], product(), 0)).toEqual([]);
  });

  it("removes an item when its quantity is set to zero", () => {
    const items = addItem([], product(), 2);
    expect(setItemQuantity(items, "p1", 0)).toEqual([]);
  });

  it("clamps updated quantities to stock", () => {
    const items = addItem([], product({ stock: 4 }), 1);
    expect(setItemQuantity(items, "p1", 99)[0].quantity).toBe(4);
  });

  it("removes items and computes count/subtotal", () => {
    let items = addItem([], product({ id: "a", price: 10.1 }), 3);
    items = addItem(items, product({ id: "b", price: 0.2 }), 1);
    expect(cartCount(items)).toBe(4);
    expect(cartSubtotal(items)).toBe(30.5);
    expect(removeItem(items, "a").map((i) => i.id)).toEqual(["b"]);
  });

  it("clampQuantity handles NaN and fractions", () => {
    expect(clampQuantity(Number.NaN, 5)).toBe(0);
    expect(clampQuantity(2.7, 5)).toBe(2);
    expect(clampQuantity(-1, 5)).toBe(0);
  });
});

describe("parseStoredCart", () => {
  it("returns [] for missing or corrupt data", () => {
    expect(parseStoredCart(null)).toEqual([]);
    expect(parseStoredCart("{not json")).toEqual([]);
    expect(parseStoredCart('{"a":1}')).toEqual([]);
  });

  it("drops malformed entries", () => {
    const valid: CartItem = { ...product(), quantity: 1 };
    const raw = JSON.stringify([valid, { id: 1 }, null, { ...valid, id: "z", quantity: 0 }]);
    expect(parseStoredCart(raw)).toEqual([valid]);
  });
});
