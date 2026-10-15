import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/shop", "/about", "/contact", "/terms", "/returns"].map((path) => ({
    url: `${siteConfig.url}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));
  const productRoutes = products.map((p) => ({
    url: `${siteConfig.url}/products/${p.id}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
  return [...staticRoutes, ...productRoutes];
}
