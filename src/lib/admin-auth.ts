/**
 * Minimal single-admin authentication for the /admin area.
 *
 * The session cookie holds SHA-256(`sos-admin:` + ADMIN_PASSWORD + ADMIN_SESSION_SECRET).
 * Rotating either env var invalidates every session. Runs on both the Edge
 * (middleware) and Node (server actions) runtimes via Web Crypto.
 */
export const ADMIN_COOKIE = "sos_admin";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function expectedAdminToken(): Promise<string | null> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return sha256Hex(`sos-admin:${password}:${process.env.ADMIN_SESSION_SECRET ?? ""}`);
}

/** Constant-time string comparison to avoid leaking token prefixes via timing. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function isValidAdminToken(token: string | undefined): Promise<boolean> {
  const expected = await expectedAdminToken();
  return Boolean(expected && token && safeEqual(token, expected));
}

export async function verifyAdminPassword(candidate: string): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  // Compare hashes so the comparison length doesn't depend on the secret.
  return safeEqual(await sha256Hex(candidate), await sha256Hex(password));
}
