"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/providers/cart-provider";
import type { Product } from "@/types";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Button onClick={handleAddToCart} className="w-full">
      <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
    </Button>
  );
}
