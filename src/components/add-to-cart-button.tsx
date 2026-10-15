"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { useCart } from "@/providers/cart-provider";
import type { Product } from "@/types";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps extends Omit<ButtonProps, "onClick"> {
  product: Product;
  quantity?: number;
}

export function AddToCartButton({ product, quantity = 1, className, ...props }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const soldOut = product.stock <= 0;

  const handleAddToCart = () => {
    const result = addToCart(product, quantity);
    if (result === "added") {
      toast({ title: "Added to cart", description: `${quantity} × ${product.name}` });
    } else if (result === "limited") {
      toast({
        title: "Stock limit reached",
        description: `Only ${product.stock} of ${product.name} available — your cart has the maximum.`,
      });
    }
  };

  return (
    <Button onClick={handleAddToCart} disabled={soldOut} className={cn("w-full", className)} {...props}>
      <ShoppingCart className="mr-2 h-4 w-4" /> {soldOut ? "Sold out" : "Add to Cart"}
    </Button>
  );
}
