"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { useCart } from "@/providers/cart-provider";
import type { Product } from "@/types";

export function ProductPurchase({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, setIsCartOpen } = useCart();
  const router = useRouter();
  const soldOut = product.stock <= 0;

  const setClamped = (value: number) => {
    if (!Number.isFinite(value)) return;
    setQuantity(Math.max(1, Math.min(product.stock, Math.floor(value))));
  };

  const buyNow = () => {
    addToCart(product, quantity);
    setIsCartOpen(false);
    router.push("/checkout");
  };

  if (soldOut) {
    return (
      <div className="mt-8 rounded-xl border border-dashed p-4 text-center text-muted-foreground">
        This item is currently sold out. Please check back soon or{" "}
        <a href="/contact" className="font-medium text-primary hover:underline">
          contact us
        </a>
        .
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      <div>
        <label htmlFor="quantity" className="text-sm font-medium">
          Quantity
        </label>
        <div className="mt-2 inline-flex items-center rounded-lg border">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Decrease quantity"
            onClick={() => setClamped(quantity - 1)}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <input
            id="quantity"
            type="number"
            inputMode="numeric"
            min={1}
            max={product.stock}
            value={quantity}
            onChange={(e) => setClamped(Number(e.target.value))}
            className="h-10 w-14 bg-transparent text-center font-medium outline-none"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Increase quantity"
            onClick={() => setClamped(quantity + 1)}
            disabled={quantity >= product.stock}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <AddToCartButton product={product} quantity={quantity} size="lg" variant="outline" />
        <Button size="lg" onClick={buyNow}>
          <Zap className="mr-2 h-4 w-4" /> Buy Now
        </Button>
      </div>
    </div>
  );
}
