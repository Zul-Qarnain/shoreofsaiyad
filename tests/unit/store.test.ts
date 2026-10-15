import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { checkoutSchema } from "@/lib/checkout";
import {
  addMessage,
  createOrder,
  getLiveProduct,
  getOrderById,
  listMessages,
  setMessageRead,
  updateOrderStatus,
} from "@/lib/server/store";

const form = checkoutSchema.parse({
  name: "Ayesha Rahman",
  phone: "01712345678",
  email: "",
  address: "House 12, Road 5, Dhanmondi",
  city: "Dhaka",
  notes: "",
  deliveryZone: "inside-dhaka",
  paymentMethod: "cod",
  wallet: "bkash",
  transactionId: "9A7B6C5D4E",
});

let dir: string;
beforeEach(async () => {
  dir = await mkdtemp(path.join(os.tmpdir(), "sos-store-"));
  process.env.DATA_DIR = dir;
});
afterEach(async () => {
  delete process.env.DATA_DIR;
  await rm(dir, { recursive: true, force: true });
});

describe("file store", () => {
  it("persists orders and deducts stock", async () => {
    const result = await createOrder([{ id: "8", quantity: 2 }], form); // Papyrus, stock 3
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.order.total).toBe(28 * 2 + 70);
    expect((await getLiveProduct("8"))?.stock).toBe(1);
    expect((await getOrderById(result.order.id))?.customer.name).toBe("Ayesha Rahman");
    const raw = JSON.parse(await readFile(path.join(dir, "store.json"), "utf8"));
    expect(raw.orders).toHaveLength(1);
  });

  it("never oversells under concurrent orders", async () => {
    const results = await Promise.all(Array.from({ length: 5 }, () => createOrder([{ id: "8", quantity: 1 }], form)));
    expect(results.filter((r) => r.ok)).toHaveLength(3);
    expect((await getLiveProduct("8"))?.stock).toBe(0);
  });

  it("restores stock when an order is cancelled, once", async () => {
    const result = await createOrder([{ id: "8", quantity: 3 }], form);
    if (!result.ok) throw new Error(result.error);
    expect(await updateOrderStatus(result.order.id, "Cancelled")).toEqual({ ok: true });
    expect((await getLiveProduct("8"))?.stock).toBe(3);
    expect((await updateOrderStatus(result.order.id, "Cancelled")).ok).toBe(false);
    expect((await getLiveProduct("8"))?.stock).toBe(3);
    expect((await updateOrderStatus("SOS-NOPE", "Confirmed")).ok).toBe(false);
  });

  it("stores contact messages", async () => {
    const m = await addMessage({ name: "Rafi", email: "rafi@example.com", message: "Do you gift wrap?" });
    await setMessageRead(m.id, true);
    expect(await listMessages()).toEqual([expect.objectContaining({ id: m.id, read: true })]);
  });
});
