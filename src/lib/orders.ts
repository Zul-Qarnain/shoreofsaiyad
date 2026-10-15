import type { Order } from "@/types";

/**
 * Client-side order store. Orders are kept in localStorage so the customer can
 * revisit their invoice from the same device. Replace with an API/database
 * call once a backend is connected (see README "Roadmap").
 */
const STORAGE_KEY = "sos-orders";
const MAX_ORDERS = 50;

function readAll(): Record<string, Order> {
  if (typeof window === "undefined") return {};
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as Record<string, Order>) : {};
  } catch {
    return {};
  }
}

export function saveOrder(order: Order): void {
  const all = readAll();
  all[order.id] = order;
  const trimmed = Object.values(all)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, MAX_ORDERS);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(trimmed.map((o) => [o.id, o]))));
}

export function getOrder(id: string): Order | undefined {
  return readAll()[id];
}
