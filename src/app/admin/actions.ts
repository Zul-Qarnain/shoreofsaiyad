"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  ADMIN_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  expectedAdminToken,
  isAdminConfigured,
  isValidAdminToken,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export interface LoginState {
  error?: string;
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!isAdminConfigured()) {
    return { error: "Admin access is disabled. Set ADMIN_PASSWORD in the server environment." };
  }
  const password = String(formData.get("password") ?? "");
  if (!(await verifyAdminPassword(password))) {
    return { error: "Incorrect password." };
  }
  const token = await expectedAdminToken();
  (await cookies()).set(ADMIN_COOKIE, token!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
  redirect("/admin");
}

export async function logout(): Promise<void> {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

const describeSchema = z.object({
  productName: z.string().trim().min(2).max(100),
  productCategory: z.string().trim().min(2).max(60),
  keyFeatures: z.string().trim().min(3).max(1000),
  targetAudience: z.string().trim().min(2).max(200),
  tone: z.string().trim().min(2).max(40),
});

export type DescribeInput = z.infer<typeof describeSchema>;
export type DescribeResult = { ok: true; description: string } | { ok: false; error: string };

export async function generateDescriptionAction(input: DescribeInput): Promise<DescribeResult> {
  // Server actions are public endpoints: re-check auth here, not just in middleware.
  if (!(await isValidAdminToken((await cookies()).get(ADMIN_COOKIE)?.value))) {
    return { ok: false, error: "Your session has expired. Please sign in again." };
  }
  const parsed = describeSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please fill in every field." };
  }
  if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY && !process.env.GOOGLE_GENAI_API_KEY) {
    return { ok: false, error: "AI is not configured. Set GEMINI_API_KEY in the server environment." };
  }
  try {
    const { generateProductDescription } = await import("@/ai/flows/generate-product-descriptions");
    const { description } = await generateProductDescription(parsed.data);
    return { ok: true, description };
  } catch (err) {
    console.error("generateProductDescription failed", err);
    return { ok: false, error: "The AI service failed to respond. Please try again." };
  }
}
