import type { CartItem, Order, OrderStatus, Product } from "@/types";

/** Live stock levels keyed by product id. Missing ids fall back to the catalog value. */
export type StockMap = Record<string, number>;

export interface OrderLine {
  id: string;
  quantity: number;
}

export function stockOf(product: Product, stock: StockMap): number {
  return stock[product.id] ?? product.stock;
}

export function withLiveStock(catalog: Product[], stock: StockMap): Product[] {
  return catalog.map((p) => ({ ...p, stock: stockOf(p, stock) }));
}

/** Merges duplicate lines and drops anything that isn't a positive integer quantity. */
export function normalizeLines(lines: OrderLine[]): OrderLine[] {
  const merged = new Map<string, number>();
  for (const { id, quantity } of lines) {
    if (typeof id !== "string" || !Number.isInteger(quantity) || quantity <= 0) continue;
    merged.set(id, (merged.get(id) ?? 0) + quantity);
  }
  return Array.from(merged, ([id, quantity]) => ({ id, quantity }));
}

export type ReserveResult =
  | { ok: true; items: CartItem[]; stock: StockMap }
  | { ok: false; error: string; available: StockMap };

/**
 * Prices lines from the catalog (never from the client) and deducts them from stock.
 * Fails without side effects if any product is unknown or short on stock.
 */
export function reserveStock(catalog: Product[], stock: StockMap, rawLines: OrderLine[]): ReserveResult {
  const lines = normalizeLines(rawLines);
  if (lines.length === 0) return { ok: false, error: "Your cart is empty.", available: {} };

  const items: CartItem[] = [];
  const shortages: string[] = [];
  const available: StockMap = {};
  for (const line of lines) {
    const product = catalog.find((p) => p.id === line.id);
    if (!product) {
      shortages.push("an item that is no longer sold");
      available[line.id] = 0;
      continue;
    }
    const inStock = stockOf(product, stock);
    available[product.id] = inStock;
    if (line.quantity > inStock) {
      shortages.push(inStock > 0 ? `${product.name} (only ${inStock} left)` : `${product.name} (sold out)`);
      continue;
    }
    items.push({ ...product, stock: inStock, quantity: line.quantity });
  }

  if (shortages.length > 0) {
    return { ok: false, error: `Not enough stock for ${shortages.join(", ")}. Your cart has been updated.`, available };
  }
  const next = { ...stock };
  for (const item of items) next[item.id] = item.stock - item.quantity;
  return { ok: true, items, stock: next };
}

/** Puts an order's units back on the shelf (used when an order is cancelled). */
export function releaseStock(catalog: Product[], stock: StockMap, order: Pick<Order, "items">): StockMap {
  const next = { ...stock };
  for (const item of order.items) {
    const product = catalog.find((p) => p.id === item.id);
    if (product) next[item.id] = stockOf(product, next) + item.quantity;
  }
  return next;
}

const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  "Pending Verification": ["Confirmed", "Cancelled"],
  Confirmed: ["Shipped", "Cancelled"],
  Shipped: ["Delivered"],
  Delivered: [],
  Cancelled: [],
};

export function allowedTransitions(status: OrderStatus): OrderStatus[] {
  return TRANSITIONS[status] ?? [];
}

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return allowedTransitions(from).includes(to);
}
