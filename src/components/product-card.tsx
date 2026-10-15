import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { Price } from "@/components/price";
import { StockBadge } from "@/components/stock-badge";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const onSale = product.compareAtPrice !== undefined && product.compareAtPrice > product.price;
  return (
    <article
      data-testid="product-card"
      className="group flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <Link href={`/products/${product.id}`} className="relative block overflow-hidden" tabIndex={-1} aria-hidden="true">
        <div className="relative aspect-square w-full overflow-hidden bg-muted">
          <Image
            src={product.imageUrl}
            alt=""
            fill
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            data-ai-hint={product.dataAiHint}
          />
        </div>
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {onSale && <Badge className="bg-primary">Sale</Badge>}
          <StockBadge stock={product.stock} />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{product.category}</p>
        <h3 className="mt-1 text-sm font-semibold leading-snug sm:text-base">
          <Link href={`/products/${product.id}`} className="hover:text-primary">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-xs text-muted-foreground sm:text-sm">{product.description}</p>
        <Price price={product.price} compareAtPrice={product.compareAtPrice} className="mt-3 text-base sm:text-lg" />
        <AddToCartButton product={product} className="mt-3 px-2 text-xs sm:mt-4 sm:px-4 sm:text-sm" />
      </div>
    </article>
  );
}
