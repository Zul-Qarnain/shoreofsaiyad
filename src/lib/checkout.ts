import { z } from "zod";
import type { CartItem, DeliveryZone, MobileWallet, Order, PaymentMethod } from "@/types";
import { cartSubtotal, roundMoney } from "@/lib/cart";

export const deliveryOptions: Record<DeliveryZone, { name: string; time: string; price: number }> = {
  "inside-dhaka": { name: "Inside Dhaka", time: "2-3 days", price: 70 },
  "sub-dhaka": { name: "Sub Dhaka", time: "2-3 days", price: 100 },
  "outside-dhaka": { name: "Outside Dhaka", time: "3-5 days", price: 130 },
};

export const walletNames: Record<MobileWallet, string> = { bkash: "bKash", nagad: "Nagad" };

const BD_PHONE = /^(?:\+?88)?01[3-9]\d{8}$/;

export function normalizePhone(value: string): string {
  return value.replace(/[\s-]/g, "");
}

export const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(80),
  phone: z
    .string()
    .trim()
    .transform(normalizePhone)
    .refine((v) => BD_PHONE.test(v), "Enter a valid Bangladeshi mobile number, e.g. 01712345678."),
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email address.")]).optional(),
  address: z.string().trim().min(8, "Please enter your full delivery address.").max(250),
  city: z.string().trim().min(2, "Please enter your city / area.").max(60),
  notes: z.string().trim().max(300).optional(),
  deliveryZone: z.enum(["inside-dhaka", "sub-dhaka", "outside-dhaka"]),
  paymentMethod: z.enum(["cod", "mobile"]),
  wallet: z.enum(["bkash", "nagad"]),
  transactionId: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9]{6,20}$/, "Transaction ID should be 6-20 letters or numbers."),
});

export type CheckoutFormValues = z.input<typeof checkoutSchema>;
export type CheckoutData = z.output<typeof checkoutSchema>;

export interface OrderTotals {
  subtotal: number;
  deliveryCharge: number;
  total: number;
  /** What the customer must send via bKash/Nagad before the order is processed. */
  payNow: number;
  dueOnDelivery: number;
}

/**
 * Cash on Delivery still requires the delivery charge in advance (see Terms §2),
 * so the product price is collected by the rider. Mobile payment covers everything upfront.
 */
export function computeTotals(items: CartItem[], zone: DeliveryZone, method: PaymentMethod): OrderTotals {
  const subtotal = cartSubtotal(items);
  const deliveryCharge = deliveryOptions[zone].price;
  const total = roundMoney(subtotal + deliveryCharge);
  const payNow = method === "cod" ? deliveryCharge : total;
  return { subtotal, deliveryCharge, total, payNow, dueOnDelivery: roundMoney(total - payNow) };
}

export function generateOrderId(now = new Date()): string {
  const date = now.toISOString().slice(2, 10).replace(/-/g, "");
  const bytes = new Uint8Array(3);
  globalThis.crypto.getRandomValues(bytes);
  const rand = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
  return `SOS-${date}-${rand}`;
}

export function buildOrder(items: CartItem[], data: CheckoutData, now = new Date()): Order {
  const totals = computeTotals(items, data.deliveryZone, data.paymentMethod);
  return {
    id: generateOrderId(now),
    createdAt: now.toISOString(),
    status: "Pending Verification",
    customer: {
      name: data.name,
      phone: data.phone,
      email: data.email || undefined,
      address: data.address,
      city: data.city,
      notes: data.notes || undefined,
    },
    items: items.map(({ id, name, price, quantity, imageUrl }) => ({ id, name, price, quantity, imageUrl })),
    deliveryZone: data.deliveryZone,
    payment: {
      method: data.paymentMethod,
      wallet: data.wallet,
      transactionId: data.transactionId.toUpperCase(),
      paidAmount: totals.payNow,
      dueOnDelivery: totals.dueOnDelivery,
    },
    subtotal: totals.subtotal,
    deliveryCharge: totals.deliveryCharge,
    total: totals.total,
  };
}
