import { rm } from "node:fs/promises";

/** Start every E2E run with an empty order/stock/message store. */
export default async function globalSetup() {
  await rm(".data-e2e", { recursive: true, force: true });
}
