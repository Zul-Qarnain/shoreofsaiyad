import type { CartItem, Product } from "@/types";

/** Pure cart operations. Every function returns a new array and respects stock limits. */

export function clampQuantity(quantity: number, stock: number): number {
  if (!Number.isFinite(quantity)) return 0;
  return Math.max(0, Math.min(Math.floor(quantity), stock));
}

export function addItem(items: CartItem[], product: Product, quantity = 1): CartItem[] {
  if (product.stock <= 0 || quantity <= 0) return items;
  const existing = items.find((i) => i.id === product.id);
  if (existing) {
    return items.map((i) =>
      i.id === product.id ? { ...i, stock: product.stock, quantity: clampQuantity(i.quantity + quantity, product.stock) } : i
    );
  }
  return [...items, { ...product, quantity: clampQuantity(quantity, product.stock) }];
}

export function setItemQuantity(items: CartItem[], productId: string, quantity: number): CartItem[] {
  return items
    .map((i) => (i.id === productId ? { ...i, quantity: clampQuantity(quantity, i.stock) } : i))
    .filter((i) => i.quantity > 0);
}

export function removeItem(items: CartItem[], productId: string): CartItem[] {
  return items.filter((i) => i.id !== productId);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((acc, i) => acc + i.quantity, 0);
}

export function cartSubtotal(items: CartItem[]): number {
  return roundMoney(items.reduce((acc, i) => acc + i.price * i.quantity, 0));
}

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Validates data read from localStorage so a corrupted/stale value can't crash the app. */
export function parseStoredCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.filter(
      (i): i is CartItem =>
        !!i &&
        typeof i === "object" &&
        typeof i.id === "string" &&
        typeof i.name === "string" &&
        typeof i.price === "number" &&
        typeof i.quantity === "number" &&
        typeof i.stock === "number" &&
        i.quantity > 0
    );
  } catch {
    return [];
  }
}

/** Updates cart lines with live stock levels, clamping quantities and dropping sold-out items. */
export function applyStockLevels(items: CartItem[], levels: Record<string, number>): CartItem[] {
  return items
    .map((i) => {
      const stock = levels[i.id];
      if (stock === undefined) return i;
      return { ...i, stock, quantity: clampQuantity(i.quantity, stock) };
    })
    .filter((i) => i.quantity > 0);
}
