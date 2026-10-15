import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Star, Truck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/price";
import { StockBadge } from "@/components/stock-badge";
import { ProductCard } from "@/components/product-card";
import { ProductPurchase } from "@/components/product-purchase";
import { ProductReviews } from "@/components/product-reviews";
import { averageRating, getProductById, getRelatedProducts, getReviewsForProduct } from "@/lib/products";
import { withLiveStock } from "@/lib/inventory";
import { getLiveProduct, getStockLevels } from "@/lib/server/store";
import { siteConfig } from "@/lib/site";

type Params = Promise<{ id: string }>;

// Stock changes with every order, so render on each request.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description,
    openGraph: { title: product.name, description: product.description, images: [product.imageUrl] },
  };
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const product = await getLiveProduct(id);
  if (!product) notFound();

  const productReviews = getReviewsForProduct(product.id);
  const rating = averageRating(productReviews);
  const relatedStatic = getRelatedProducts(product);
  const related = withLiveStock(relatedStatic, await getStockLevels(relatedStatic.map((p) => p.id)));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.imageUrl,
    description: product.description,
    category: product.category,
    offers: {
      "@type": "Offer",
      priceCurrency: "BDT",
      price: product.price.toFixed(2),
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: siteConfig.name },
    },
    ...(productReviews.length > 0 && {
      aggregateRating: { "@type": "AggregateRating", ratingValue: rating.toFixed(1), reviewCount: productReviews.length },
    }),
  };

  return (
    <div className="container py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-primary">
          {product.category}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="line-clamp-1 text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border bg-muted shadow-lg">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            data-ai-hint={product.dataAiHint}
          />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{product.category}</Badge>
            <StockBadge stock={product.stock} />
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{product.name}</h1>
          {productReviews.length > 0 && (
            <a href="#reviews" className="mt-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
              <Star className="h-4 w-4 fill-gold text-gold" />
              {rating.toFixed(1)} · {productReviews.length} review{productReviews.length === 1 ? "" : "s"}
            </a>
          )}
          <Price price={product.price} compareAtPrice={product.compareAtPrice} className="mt-4 block text-3xl" />
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">{product.description}</p>

          <ProductPurchase product={product} />

          <div className="mt-6 flex items-start gap-3 rounded-xl bg-secondary/50 p-4 text-sm">
            <Truck className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
            <p>
              Delivery in 2–5 days. Inspect your item in front of the rider —{" "}
              <Link href="/returns" className="font-medium text-primary underline-offset-4 hover:underline">
                return policy
              </Link>
              .
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold">Product Details</h2>
            <Separator className="my-3" />
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="font-medium">Material</dt>
                <dd className="text-right text-muted-foreground">{product.material ?? "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-medium">Care</dt>
                <dd className="text-right text-muted-foreground">{product.care ?? "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-medium">Availability</dt>
                <dd className="text-right text-muted-foreground">
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <ProductReviews reviews={productReviews} />

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">You may also like</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
