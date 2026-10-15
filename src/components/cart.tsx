"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/providers/cart-provider";
import { formatPrice } from "@/lib/format";

export function Cart() {
  const { cartItems, cartTotal, cartCount, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen } = useCart();

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      {/* Opens from the left by design (requested in the original spec). */}
      <SheetContent side="left" className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="px-6 pt-6">
          <SheetTitle>Your Cart</SheetTitle>
          <SheetDescription>
            {cartCount === 0 ? "No items yet" : `${cartCount} item${cartCount === 1 ? "" : "s"}`}
          </SheetDescription>
        </SheetHeader>
        <Separator className="mt-4" />
        {cartItems.length > 0 ? (
          <>
            <ScrollArea className="flex-1">
              <ul className="flex flex-col gap-5 p-6">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex items-start gap-4" data-testid="cart-item">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border bg-muted">
                      <Image src={item.imageUrl} alt={item.name} fill sizes="80px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <SheetClose asChild>
                        <Link href={`/products/${item.id}`} className="line-clamp-1 font-semibold hover:text-primary">
                          {item.name}
                        </Link>
                      </SheetClose>
                      <p className="text-sm text-muted-foreground">{formatPrice(item.price)}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          aria-label={`Decrease quantity of ${item.name}`}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <span className="w-6 text-center text-sm font-medium" aria-live="polite">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          aria-label={`Increase quantity of ${item.name}`}
                          disabled={item.quantity >= item.stock}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        aria-label={`Remove ${item.name}`}
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
            <Separator />
            <SheetFooter className="p-6">
              <div className="flex w-full flex-col gap-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <p className="text-xs text-muted-foreground">Delivery charge is calculated at checkout.</p>
                <SheetClose asChild>
                  <Button asChild size="lg" className="w-full">
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold">Your cart is empty</h3>
            <p className="text-muted-foreground">Looks like you haven&apos;t added anything yet.</p>
            <SheetClose asChild>
              <Button asChild>
                <Link href="/shop">Start Shopping</Link>
              </Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
