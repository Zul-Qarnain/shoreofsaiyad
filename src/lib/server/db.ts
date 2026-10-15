import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ContactMessage, Order } from "@/types";
import type { StockMap } from "@/lib/inventory";

/**
 * Minimal file-backed data store (orders, live stock, contact messages) so the
 * shop works end-to-end on a single server without external services.
 * Data lives in `$DATA_DIR/store.json` (default `./.data`).
 *
 * Writes are serialized in-process and replaced atomically (write + rename).
 * This is fine for one Node process; for serverless or multi-instance hosting,
 * re-implement these functions on a real database (e.g. Firestore).
 */
export interface StoreData {
  orders: Order[];
  stock: StockMap;
  messages: ContactMessage[];
}

const MAX_MESSAGES = 500;

function dataFile(): string {
  return path.join(path.resolve(process.env.DATA_DIR || ".data"), "store.json");
}

function empty(): StoreData {
  return { orders: [], stock: {}, messages: [] };
}

async function load(): Promise<StoreData> {
  try {
    const parsed = JSON.parse(await readFile(dataFile(), "utf8")) as Partial<StoreData>;
    return {
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      stock: parsed.stock && typeof parsed.stock === "object" ? parsed.stock : {},
      messages: Array.isArray(parsed.messages) ? parsed.messages : [],
    };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return empty();
    throw err;
  }
}

async function save(data: StoreData): Promise<void> {
  const file = dataFile();
  await mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await rename(tmp, file);
}

let queue: Promise<unknown> = Promise.resolve();

/**
 * Runs `fn` with exclusive access to the store. If `fn` returns `{ data, result }`
 * the new data is persisted; returning `{ result }` alone leaves the store unchanged.
 */
export function transact<T>(fn: (data: StoreData) => { data?: StoreData; result: T }): Promise<T> {
  const run = queue.then(async () => {
    const current = await load();
    const { data, result } = fn(current);
    if (data) await save(data);
    return result;
  });
  queue = run.catch(() => undefined);
  return run;
}

export function readStore(): Promise<StoreData> {
  return transact((data) => ({ result: data }));
}

export function capMessages(messages: ContactMessage[]): ContactMessage[] {
  return messages.slice(0, MAX_MESSAGES);
}
