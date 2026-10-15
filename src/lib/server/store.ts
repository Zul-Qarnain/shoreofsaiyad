import { generateOrderId, buildOrder, type CheckoutData } from "@/lib/checkout";
import { canTransition, releaseStock, reserveStock, stockOf, withLiveStock, type OrderLine, type StockMap } from "@/lib/inventory";
import { getProductById, products } from "@/lib/products";
import { capMessages, readStore, transact } from "@/lib/server/db";
import type { ContactMessage, Order, OrderStatus, Product } from "@/types";

/** Server-side data access. Only import from server components / server actions. */

export async function getLiveProducts(): Promise<Product[]> {
  const { stock } = await readStore();
  return withLiveStock(products, stock);
}

export async function getLiveProduct(id: string): Promise<Product | undefined> {
  const product = getProductById(id);
  if (!product) return undefined;
  const { stock } = await readStore();
  return { ...product, stock: stockOf(product, stock) };
}

export async function getStockLevels(ids: string[]): Promise<StockMap> {
  const { stock } = await readStore();
  const levels: StockMap = {};
  for (const id of ids) {
    const product = getProductById(id);
    levels[id] = product ? stockOf(product, stock) : 0;
  }
  return levels;
}

export type CreateOrderResult = { ok: true; order: Order } | { ok: false; error: string; available: StockMap };

/** Atomically re-prices the cart from the catalog, deducts stock and records the order. */
export function createOrder(lines: OrderLine[], data: CheckoutData, now = new Date()): Promise<CreateOrderResult> {
  return transact<CreateOrderResult>((store) => {
    const reserved = reserveStock(products, store.stock, lines);
    if (!reserved.ok) return { result: reserved };
    let order = buildOrder(reserved.items, data, now);
    while (store.orders.some((o) => o.id === order.id)) order = { ...order, id: generateOrderId(now) };
    return {
      data: { ...store, stock: reserved.stock, orders: [order, ...store.orders] },
      result: { ok: true, order },
    };
  });
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const { orders } = await readStore();
  return orders.find((o) => o.id === id);
}

export async function listOrders(): Promise<Order[]> {
  return (await readStore()).orders;
}

export type UpdateStatusResult = { ok: true } | { ok: false; error: string };

export function updateOrderStatus(id: string, status: OrderStatus): Promise<UpdateStatusResult> {
  return transact<UpdateStatusResult>((store) => {
    const order = store.orders.find((o) => o.id === id);
    if (!order) return { result: { ok: false, error: "Order not found." } };
    if (!canTransition(order.status, status)) {
      return { result: { ok: false, error: `Cannot change an order from "${order.status}" to "${status}".` } };
    }
    const stock = status === "Cancelled" ? releaseStock(products, store.stock, order) : store.stock;
    const orders = store.orders.map((o) => (o.id === id ? { ...o, status } : o));
    return { data: { ...store, stock, orders }, result: { ok: true } };
  });
}

export function addMessage(input: Omit<ContactMessage, "id" | "createdAt" | "read">, now = new Date()): Promise<ContactMessage> {
  return transact((store) => {
    const message: ContactMessage = {
      ...input,
      id: globalThis.crypto.randomUUID(),
      createdAt: now.toISOString(),
      read: false,
    };
    return { data: { ...store, messages: capMessages([message, ...store.messages]) }, result: message };
  });
}

export async function listMessages(): Promise<ContactMessage[]> {
  return (await readStore()).messages;
}

export function setMessageRead(id: string, read: boolean): Promise<void> {
  return transact((store) => ({
    data: { ...store, messages: store.messages.map((m) => (m.id === id ? { ...m, read } : m)) },
    result: undefined,
  }));
}
