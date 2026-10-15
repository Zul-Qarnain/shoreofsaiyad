import { describe, expect, it } from "vitest";
import { canTransition, normalizeLines, releaseStock, reserveStock, withLiveStock } from "@/lib/inventory";
import { applyStockLevels } from "@/lib/cart";
import type { CartItem, Product } from "@/types";

const catalog: Product[] = [
  { id: "a", name: "Mug", price: 25, imageUrl: "x", description: "", stock: 5, category: "Mugs" },
  { id: "b", name: "Clip", price: 12, imageUrl: "x", description: "", stock: 0, category: "Accessories" },
];

describe("reserveStock", () => {
  it("prices from the catalog and deducts stock", () => {
    const r = reserveStock(catalog, {}, [{ id: "a", quantity: 2 }]);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.items[0]).toMatchObject({ id: "a", price: 25, quantity: 2 });
    expect(r.stock).toEqual({ a: 3 });
  });

  it("uses live stock overrides", () => {
    const r = reserveStock(catalog, { a: 1 }, [{ id: "a", quantity: 2 }]);
    expect(r).toMatchObject({ ok: false, available: { a: 1 } });
    if (!r.ok) expect(r.error).toContain("only 1 left");
  });

  it("rejects sold-out and unknown products", () => {
    expect(reserveStock(catalog, {}, [{ id: "b", quantity: 1 }]).ok).toBe(false);
    expect(reserveStock(catalog, {}, [{ id: "zzz", quantity: 1 }])).toMatchObject({ ok: false, available: { zzz: 0 } });
  });

  it("rejects empty carts and merges duplicate lines", () => {
    expect(reserveStock(catalog, {}, []).ok).toBe(false);
    expect(normalizeLines([{ id: "a", quantity: 2 }, { id: "a", quantity: 3 }, { id: "a", quantity: -1 }])).toEqual([
      { id: "a", quantity: 5 },
    ]);
    expect(reserveStock(catalog, {}, [{ id: "a", quantity: 3 }, { id: "a", quantity: 3 }]).ok).toBe(false);
  });

  it("does not mutate the input stock map", () => {
    const stock = { a: 5 };
    reserveStock(catalog, stock, [{ id: "a", quantity: 1 }]);
    expect(stock).toEqual({ a: 5 });
  });
});

describe("releaseStock / withLiveStock", () => {
  it("returns units to stock", () => {
    expect(releaseStock(catalog, { a: 3 }, { items: [{ id: "a", name: "Mug", price: 25, quantity: 2, imageUrl: "x" }] })).toEqual({
      a: 5,
    });
  });

  it("overlays live stock on the catalog", () => {
    expect(withLiveStock(catalog, { a: 1 }).map((p) => p.stock)).toEqual([1, 0]);
  });
});

describe("order status transitions", () => {
  it("allows the forward flow and cancellation before shipping", () => {
    expect(canTransition("Pending Verification", "Confirmed")).toBe(true);
    expect(canTransition("Confirmed", "Cancelled")).toBe(true);
    expect(canTransition("Shipped", "Cancelled")).toBe(false);
    expect(canTransition("Cancelled", "Confirmed")).toBe(false);
    expect(canTransition("Delivered", "Pending Verification")).toBe(false);
  });
});

describe("applyStockLevels", () => {
  it("clamps cart quantities and drops sold-out lines", () => {
    const cart: CartItem[] = [
      { ...catalog[0], quantity: 4 },
      { ...catalog[1], stock: 3, quantity: 1 },
    ];
    expect(applyStockLevels(cart, { a: 2, b: 0 })).toEqual([{ ...catalog[0], stock: 2, quantity: 2 }]);
  });
});
