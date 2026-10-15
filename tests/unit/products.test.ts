import { describe, expect, it } from "vitest";
import { averageRating, filterProducts, getProductById, getRelatedProducts, products, reviews } from "@/lib/products";

describe("catalog integrity", () => {
  it("has unique ids and valid prices/stock", () => {
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
    for (const p of products) {
      expect(p.price).toBeGreaterThan(0);
      expect(p.stock).toBeGreaterThanOrEqual(0);
      if (p.compareAtPrice !== undefined) expect(p.compareAtPrice).toBeGreaterThan(p.price);
    }
  });

  it("every review references an existing product", () => {
    for (const r of reviews) expect(getProductById(r.productId)).toBeDefined();
  });
});

describe("filterProducts", () => {
  it("searches name, category and description case-insensitively", () => {
    expect(filterProducts(products, { query: "NECKLACE" }).map((p) => p.id)).toContain("5");
    expect(filterProducts(products, { query: "jewelry" }).length).toBeGreaterThan(0);
    expect(filterProducts(products, { query: "zzz-no-match" })).toEqual([]);
  });

  it("filters by category and stock", () => {
    expect(filterProducts(products, { category: "Toys" }).every((p) => p.category === "Toys")).toBe(true);
    expect(filterProducts(products, { inStockOnly: true }).every((p) => p.stock > 0)).toBe(true);
  });

  it("sorts by price and name", () => {
    const asc = filterProducts(products, { sort: "price-asc" }).map((p) => p.price);
    expect(asc).toEqual([...asc].sort((a, b) => a - b));
    const desc = filterProducts(products, { sort: "price-desc" }).map((p) => p.price);
    expect(desc).toEqual([...desc].sort((a, b) => b - a));
    const names = filterProducts(products, { sort: "name" }).map((p) => p.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  it("does not mutate the source list", () => {
    const before = products.map((p) => p.id);
    filterProducts(products, { sort: "price-desc" });
    expect(products.map((p) => p.id)).toEqual(before);
  });
});

describe("helpers", () => {
  it("related products exclude the product itself", () => {
    const p = products[0];
    expect(getRelatedProducts(p).some((r) => r.id === p.id)).toBe(false);
  });

  it("averageRating handles empty lists", () => {
    expect(averageRating([])).toBe(0);
  });
});
