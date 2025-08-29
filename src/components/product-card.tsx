import Image from "next/image";
import { AddToCartButton } from "@/components/add-to-cart-button";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group text-center">
       <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-ai-hint={product.dataAiHint}
          />
        </div>
      <h3 className="mt-4 text-lg font-semibold">{product.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{product.description}</p>
    </div>
  );
}
