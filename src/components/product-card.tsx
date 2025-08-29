
import Image from "next/image";
import { AddToCartButton } from "@/components/add-to-cart-button";
import type { Product } from "@/types";
import Link from "next/link";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
      <Link href={`/products/${product.id}`} className="block overflow-hidden">
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
            <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-ai-hint={product.dataAiHint}
            />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-sm text-muted-foreground">{product.category}</p>
        <h3 className="mt-1 text-lg font-semibold">
            <Link href={`/products/${product.id}`}>
                <span aria-hidden="true" className="absolute inset-0" />
                {product.name}
            </Link>
        </h3>
        <div className="mt-2 flex-1">
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        </div>
        <div className="mt-4 flex items-end justify-between">
            <p className="text-xl font-bold">৳{product.price.toFixed(2)}</p>
        </div>
        <div className="mt-4">
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
