import { describe, expect, it } from "vitest";
import { buildOrder, checkoutSchema, computeTotals, generateOrderId, type CheckoutFormValues } from "@/lib/checkout";
import type { CartItem } from "@/types";

const items: CartItem[] = [
  { id: "1", name: "Mask", price: 45, imageUrl: "x", description: "", stock: 10, category: "Decor", quantity: 1 },
  { id: "2", name: "Tower", price: 25.5, imageUrl: "x", description: "", stock: 10, category: "Replicas", quantity: 2 },
];

const validForm: CheckoutFormValues = {
  name: "Ayesha Rahman",
  phone: "017-1234 5678",
  email: "",
  address: "House 12, Road 5, Dhanmondi",
  city: "Dhaka",
  notes: "",
  deliveryZone: "inside-dhaka",
  paymentMethod: "cod",
  wallet: "bkash",
  transactionId: "9a7b6c5d4e",
};

describe("computeTotals", () => {
  it("COD collects only the delivery charge upfront", () => {
    expect(computeTotals(items, "inside-dhaka", "cod")).toEqual({
      subtotal: 96,
      deliveryCharge: 70,
      total: 166,
      payNow: 70,
      dueOnDelivery: 96,
    });
  });

  it("mobile payment collects everything upfront", () => {
    const t = computeTotals(items, "outside-dhaka", "mobile");
    expect(t.total).toBe(226);
    expect(t.payNow).toBe(226);
    expect(t.dueOnDelivery).toBe(0);
  });
});

describe("checkoutSchema", () => {
  it("accepts a valid form and normalizes the phone number", () => {
    const parsed = checkoutSchema.parse(validForm);
    expect(parsed.phone).toBe("01712345678");
  });

  it.each([
    ["phone", "12345"],
    ["phone", "01212345678"],
    ["name", "A"],
    ["address", "short"],
    ["email", "not-an-email"],
    ["transactionId", ""],
    ["transactionId", "abc-123!"],
  ])("rejects invalid %s (%s)", (field, value) => {
    const result = checkoutSchema.safeParse({ ...validForm, [field]: value });
    expect(result.success).toBe(false);
  });

  it("accepts +880 prefixed numbers", () => {
    expect(checkoutSchema.safeParse({ ...validForm, phone: "+8801812345678" }).success).toBe(true);
  });
});

describe("buildOrder", () => {
  it("snapshots items, customer and payment", () => {
    const now = new Date("2026-01-02T03:04:05Z");
    const order = buildOrder(items, checkoutSchema.parse(validForm), now);
    expect(order.id).toMatch(/^SOS-260102-[0-9A-F]{8}$/);
    expect(order.createdAt).toBe(now.toISOString());
    expect(order.customer.email).toBeUndefined();
    expect(order.items).toHaveLength(2);
    expect(order.items[0]).not.toHaveProperty("stock");
    expect(order.payment).toMatchObject({ transactionId: "9A7B6C5D4E", paidAmount: 70, dueOnDelivery: 96 });
    expect(order.total).toBe(166);
  });
});

describe("generateOrderId", () => {
  it("produces unique ids", () => {
    const ids = new Set(Array.from({ length: 200 }, () => generateOrderId()));
    expect(ids.size).toBe(200);
  });
});
