
import Image from "next/image";
import { AddToCartButton } from "@/components/add-to-cart-button";
import type { Product } from "@/types";
import { Button } from "./ui/button";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
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
      <div className="flex flex-1 flex-col p-4">
        <p className="text-sm text-muted-foreground">{product.category}</p>
        <h3 className="mt-1 text-lg font-semibold">{product.name}</h3>
        <p className="mt-2 text-xl font-bold">${product.price.toFixed(2)}</p>
        <div className="mt-4 flex-1">
          <p className="text-sm text-muted-foreground">{product.description}</p>
        </div>
        <div className="mt-4">
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
