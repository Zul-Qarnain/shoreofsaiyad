"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, ShoppingBag } from "lucide-react";
import { useCart } from "@/providers/cart-provider";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  buildOrder,
  checkoutSchema,
  computeTotals,
  deliveryOptions,
  walletNames,
  type CheckoutData,
  type CheckoutFormValues,
} from "@/lib/checkout";
import { saveOrder } from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import { siteConfig } from "@/lib/site";
import type { DeliveryZone, MobileWallet, PaymentMethod } from "@/types";

const optionCard =
  "flex cursor-pointer items-center justify-between gap-4 rounded-lg border p-4 transition-colors hover:bg-accent/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5";

export function CheckoutForm() {
  const { cartItems, isHydrated, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [placing, setPlacing] = useState(false);

  const form = useForm<CheckoutFormValues, unknown, CheckoutData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      notes: "",
      deliveryZone: "inside-dhaka",
      paymentMethod: "cod",
      wallet: "bkash",
      transactionId: "",
    },
  });

  const zone = form.watch("deliveryZone") as DeliveryZone;
  const method = form.watch("paymentMethod") as PaymentMethod;
  const wallet = form.watch("wallet") as MobileWallet;
  const totals = computeTotals(cartItems, zone, method);
  const walletNumber = wallet === "bkash" ? siteConfig.bkashNumber : siteConfig.nagadNumber;

  const onSubmit = (data: CheckoutData) => {
    if (cartItems.length === 0) return;
    setPlacing(true);
    try {
      const order = buildOrder(cartItems, data);
      saveOrder(order);
      router.replace(`/invoice/${order.id}`);
      clearCart();
      toast({ title: "Order placed!", description: `Order ${order.id} is awaiting payment verification.` });
    } catch {
      setPlacing(false);
      toast({
        variant: "destructive",
        title: "Could not place order",
        description: "Please check your browser storage settings and try again.",
      });
    }
  };

  if (!isHydrated || placing) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]" aria-busy="true">
        {placing ? (
          <div className="col-span-full flex flex-col items-center gap-3 py-20 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            Placing your order…
          </div>
        ) : (
          <>
            <Skeleton className="h-[600px] rounded-xl" />
            <Skeleton className="h-[400px] rounded-xl" />
          </>
        )}
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center py-12 text-center">
        <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
        <h2 className="mt-4 text-2xl font-semibold">Your cart is empty</h2>
        <p className="mt-2 text-muted-foreground">Add items to your cart to proceed to checkout.</p>
        <Button asChild className="mt-6">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="grid gap-8 lg:grid-cols-[1fr_400px] lg:items-start">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
              <CardDescription>No account needed — we&apos;ll call to confirm your order.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input autoComplete="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile number</FormLabel>
                    <FormControl>
                      <Input type="tel" inputMode="tel" autoComplete="tel" placeholder="01XXXXXXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>
                      Email <span className="font-normal text-muted-foreground">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="email" autoComplete="email" placeholder="For your invoice" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Full address</FormLabel>
                    <FormControl>
                      <Input autoComplete="street-address" placeholder="House, road, area" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City / District</FormLabel>
                    <FormControl>
                      <Input autoComplete="address-level2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>
                      Order notes <span className="font-normal text-muted-foreground">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea rows={2} placeholder="Gift wrapping, preferred delivery time…" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="deliveryZone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup value={field.value} onValueChange={field.onChange} className="gap-3">
                        {(Object.keys(deliveryOptions) as DeliveryZone[]).map((key) => {
                          const opt = deliveryOptions[key];
                          return (
                            <label key={key} htmlFor={`zone-${key}`} className={optionCard}>
                              <div className="flex items-center gap-3">
                                <RadioGroupItem value={key} id={`zone-${key}`} />
                                <div>
                                  <p className="font-semibold">{opt.name}</p>
                                  <p className="text-sm text-muted-foreground">{opt.time}</p>
                                </div>
                              </div>
                              <p className="font-semibold">{formatPrice(opt.price)}</p>
                            </label>
                          );
                        })}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
              <CardDescription>
                Per our{" "}
                <Link href="/terms" className="text-primary underline-offset-4 hover:underline">
                  terms
                </Link>
                , Cash on Delivery orders require the delivery charge in advance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup value={field.value} onValueChange={field.onChange} className="gap-3">
                        <label htmlFor="pay-cod" className={optionCard}>
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="cod" id="pay-cod" />
                            <div>
                              <p className="font-semibold">Cash on Delivery</p>
                              <p className="text-sm text-muted-foreground">Pay delivery charge now, product price to the rider</p>
                            </div>
                          </div>
                        </label>
                        <label htmlFor="pay-mobile" className={optionCard}>
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="mobile" id="pay-mobile" />
                            <div>
                              <p className="font-semibold">Full payment via bKash / Nagad</p>
                              <p className="text-sm text-muted-foreground">Pay the entire amount now</p>
                            </div>
                          </div>
                        </label>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="space-y-4 rounded-xl border bg-secondary/40 p-4">
                <FormField
                  control={form.control}
                  name="wallet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pay with</FormLabel>
                      <FormControl>
                        <RadioGroup value={field.value} onValueChange={field.onChange} className="grid grid-cols-2 gap-3">
                          {(Object.keys(walletNames) as MobileWallet[]).map((w) => (
                            <label key={w} htmlFor={`wallet-${w}`} className={optionCard}>
                              <span className="font-semibold">{walletNames[w]}</span>
                              <RadioGroupItem value={w} id={`wallet-${w}`} />
                            </label>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="rounded-lg bg-card p-4 text-center text-sm">
                  <p>
                    Send <span className="font-bold" data-testid="pay-now">{formatPrice(totals.payNow)}</span> (Send Money) to
                    our {walletNames[wallet]} number:
                  </p>
                  <p className="my-2 select-all font-headline text-xl font-bold tracking-widest text-primary">{walletNumber}</p>
                  <p className="text-muted-foreground">Then enter the Transaction ID you receive below.</p>
                </div>
                <FormField
                  control={form.control}
                  name="transactionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction ID</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 9A7B6C5D4E" autoComplete="off" className="uppercase" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:sticky lg:top-24">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex items-center gap-4">
                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                      <Image src={item.imageUrl} alt={item.name} fill sizes="56px" className="object-cover" />
                      <span className="absolute -right-0 -top-0 rounded-bl-md bg-primary px-1.5 text-[11px] font-bold text-primary-foreground">
                        {item.quantity}
                      </span>
                    </div>
                    <p className="flex-1 text-sm font-medium">{item.name}</p>
                    <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </li>
                ))}
              </ul>
              <Separator className="my-5" />
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd>{formatPrice(totals.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Delivery ({deliveryOptions[zone].name})</dt>
                  <dd>{formatPrice(totals.deliveryCharge)}</dd>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <dt>Total</dt>
                  <dd data-testid="order-total">{formatPrice(totals.total)}</dd>
                </div>
                <div className="flex justify-between text-primary">
                  <dt>Pay now</dt>
                  <dd className="font-semibold">{formatPrice(totals.payNow)}</dd>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <dt>Due on delivery</dt>
                  <dd>{formatPrice(totals.dueOnDelivery)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          <div className="mt-4 flex flex-col gap-2">
            <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
              <Lock className="mr-2 h-4 w-4" /> Place Order
            </Button>
            <Button type="button" size="lg" variant="ghost" className="w-full" onClick={() => router.push("/shop")}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
