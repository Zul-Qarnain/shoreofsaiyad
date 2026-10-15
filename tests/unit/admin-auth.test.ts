import { afterEach, describe, expect, it, vi } from "vitest";
import { expectedAdminToken, isValidAdminToken, safeEqual, verifyAdminPassword } from "@/lib/admin-auth";

afterEach(() => vi.unstubAllEnvs());

describe("admin auth", () => {
  it("is disabled without ADMIN_PASSWORD", async () => {
    vi.stubEnv("ADMIN_PASSWORD", "");
    expect(await expectedAdminToken()).toBeNull();
    expect(await verifyAdminPassword("")).toBe(false);
    expect(await isValidAdminToken("anything")).toBe(false);
  });

  it("verifies password and token", async () => {
    vi.stubEnv("ADMIN_PASSWORD", "s3cret");
    expect(await verifyAdminPassword("s3cret")).toBe(true);
    expect(await verifyAdminPassword("wrong")).toBe(false);
    const token = await expectedAdminToken();
    expect(token).toMatch(/^[0-9a-f]{64}$/);
    expect(await isValidAdminToken(token!)).toBe(true);
    expect(await isValidAdminToken(undefined)).toBe(false);
  });

  it("rotating the session secret invalidates tokens", async () => {
    vi.stubEnv("ADMIN_PASSWORD", "s3cret");
    const token = await expectedAdminToken();
    vi.stubEnv("ADMIN_SESSION_SECRET", "rotated");
    expect(await isValidAdminToken(token!)).toBe(false);
  });

  it("safeEqual compares exactly", () => {
    expect(safeEqual("abc", "abc")).toBe(true);
    expect(safeEqual("abc", "abd")).toBe(false);
    expect(safeEqual("abc", "abcd")).toBe(false);
  });
});
