/**
 * Central store configuration. Values that differ per deployment are read from
 * NEXT_PUBLIC_* env vars so they can be changed without touching code.
 */
export const siteConfig = {
  name: "Shore of Saiyad",
  tagline: "Premium ornaments & gifts for the women you love",
  description:
    "Shore of Saiyad offers premium-quality ornaments, accessories and gifts at fair prices, with safe home delivery across Bangladesh.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:9002",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@shoreofsaiyad.com",
  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE ?? "+880 1234-567890",
  /** Merchant wallet numbers customers send bKash / Nagad payments to. */
  bkashNumber: process.env.NEXT_PUBLIC_BKASH_NUMBER ?? "01234567890",
  nagadNumber: process.env.NEXT_PUBLIC_NAGAD_NUMBER ?? "01234567890",
  social: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "",
  },
} as const;
