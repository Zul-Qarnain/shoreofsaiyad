"use server";

import { z } from "zod";
import { checkoutSchema, type CheckoutFormValues } from "@/lib/checkout";
import { contactSchema, type ContactValues } from "@/lib/contact";
import type { StockMap } from "@/lib/inventory";
import { addMessage, createOrder, getStockLevels } from "@/lib/server/store";

/** Public server actions used by the storefront. Every input is re-validated here. */

const linesSchema = z
  .array(z.object({ id: z.string().min(1).max(40), quantity: z.number().int().positive().max(99) }))
  .min(1)
  .max(50);

export type PlaceOrderResult = { ok: true; orderId: string } | { ok: false; error: string; available?: StockMap };

export async function placeOrderAction(
  lines: { id: string; quantity: number }[],
  values: CheckoutFormValues
): Promise<PlaceOrderResult> {
  const parsedLines = linesSchema.safeParse(lines);
  if (!parsedLines.success) return { ok: false, error: "Your cart is empty or invalid." };
  const parsed = checkoutSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: "Please check the highlighted fields and try again." };

  try {
    const result = await createOrder(parsedLines.data, parsed.data);
    if (!result.ok) return result;
    console.info(`[order] ${result.order.id} · ${result.order.customer.name} · total ${result.order.total}`);
    return { ok: true, orderId: result.order.id };
  } catch (err) {
    console.error("placeOrderAction failed", err);
    return { ok: false, error: "We could not save your order. Please try again in a moment." };
  }
}

export async function getStockLevelsAction(ids: string[]): Promise<StockMap> {
  const parsed = z.array(z.string().max(40)).max(50).safeParse(ids);
  if (!parsed.success) return {};
  return getStockLevels(parsed.data);
}

export type ContactResult = { ok: true } | { ok: false; error: string };

export async function sendContactMessageAction(values: ContactValues): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: "Please check the highlighted fields and try again." };
  try {
    await addMessage({ ...parsed.data, phone: parsed.data.phone || undefined });
    return { ok: true };
  } catch (err) {
    console.error("sendContactMessageAction failed", err);
    return { ok: false, error: "We could not send your message. Please try again or call us." };
  }
}
