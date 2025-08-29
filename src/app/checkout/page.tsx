"use client";

import { useState } from "react";
import { useCart } from "@/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type DeliveryZone = "inside-dhaka" | "sub-dhaka" | "outside-dhaka";
type PaymentMethod = "cod" | "mobile";
type MobilePaymentOption = "bkash" | "nagad";

const deliveryOptions = {
  "inside-dhaka": { name: "Inside Dhaka", time: "1-2 Days", price: 70 },
  "sub-dhaka": { name: "Sub Dhaka", time: "1-2 Days", price: 90 },
  "outside-dhaka": { name: "Outside Dhaka", time: "2-3 Days", price: 110 },
};

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone>("inside-dhaka");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [mobilePaymentOption, setMobilePaymentOption] = useState<MobilePaymentOption>("bkash");
  const [transactionId, setTransactionId] = useState("");


  const deliveryCharge = deliveryOptions[deliveryZone].price;
  const finalTotal = cartTotal + deliveryCharge;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'mobile' && !transactionId) {
        toast({
            variant: "destructive",
            title: "Transaction ID Required",
            description: "Please enter the transaction ID to proceed.",
        });
        return;
    }

    const orderId = Math.random().toString(36).substring(2, 10);
    toast({
      title: "Order Placed!",
      description: "Thank you for your purchase. Your invoice is being generated.",
    });
    clearCart();
    router.push(`/invoice/${orderId}`);
  };

  if (cartItems.length === 0) {
    return (
        <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-2xl font-semibold">Your cart is empty.</h1>
            <p className="text-muted-foreground mt-2">Add items to your cart to proceed to checkout.</p>
            <Button onClick={() => router.push('/')} className="mt-6">Continue Shopping</Button>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 lg:py-20">
      <h1 className="mb-8 text-center font-headline text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Checkout
      </h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start"
      >
        <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="For invoice and updates" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" required/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" required />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State / Province</Label>
                    <Input id="state" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP / Postal Code</Label>
                    <Input id="zip" required />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Delivery Zone</CardTitle>
                </CardHeader>
                <CardContent>
                    <RadioGroup value={deliveryZone} onValueChange={(value) => setDeliveryZone(value as DeliveryZone)}>
                        {Object.entries(deliveryOptions).map(([key, { name, time, price }]) => (
                            <Label key={key} htmlFor={key} className="flex cursor-pointer items-center justify-between rounded-lg border p-4 has-[input:checked]:border-primary">
                                <div>
                                    <p className="font-semibold">{name}</p>
                                    <p className="text-sm text-muted-foreground">{time}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                     <p className="font-semibold">৳{price.toFixed(2)}</p>
                                    <RadioGroupItem value={key} id={key} />
                                </div>
                            </Label>
                        ))}
                    </RadioGroup>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)} className="space-y-4">
                        <Label htmlFor="cod" className="flex cursor-pointer items-center justify-between rounded-lg border p-4 has-[input:checked]:border-primary">
                           <span className="font-semibold">Cash on Delivery</span>
                           <RadioGroupItem value="cod" id="cod" />
                        </Label>
                         <Label htmlFor="mobile" className="flex cursor-pointer items-center justify-between rounded-lg border p-4 has-[input:checked]:border-primary">
                           <span className="font-semibold">Pay with Bkash/Nagad</span>
                           <RadioGroupItem value="mobile" id="mobile" />
                        </Label>
                    </RadioGroup>

                    {paymentMethod === 'mobile' && (
                        <div className="mt-6 space-y-6 border-t pt-6">
                             <RadioGroup value={mobilePaymentOption} onValueChange={(value) => setMobilePaymentOption(value as MobilePaymentOption)} className="grid grid-cols-2 gap-4">
                                <Label htmlFor="bkash" className="flex cursor-pointer items-center gap-4 rounded-lg border p-4 has-[input:checked]:border-primary">
                                    <RadioGroupItem value="bkash" id="bkash" />
                                    <span className="font-semibold">Bkash</span>
                                </Label>
                                <Label htmlFor="nagad" className="flex cursor-pointer items-center gap-4 rounded-lg border p-4 has-[input:checked]:border-primary">
                                    <RadioGroupItem value="nagad" id="nagad" />
                                    <span className="font-semibold">Nagad</span>
                                </Label>
                             </RadioGroup>
                             <Card className="bg-muted/30">
                                 <CardContent className="p-4">
                                    <p className="text-center text-sm">
                                        Send money to the following {mobilePaymentOption === 'bkash' ? 'Bkash' : 'Nagad'} number:
                                    </p>
                                    <p className="my-2 text-center text-lg font-bold tracking-widest text-primary">01234567890</p>
                                    <p className="text-center text-sm">Total Amount: <span className="font-bold">৳{finalTotal.toFixed(2)}</span></p>
                                     <div className="mt-4 space-y-2">
                                        <Label htmlFor="transactionId">Transaction ID</Label>
                                        <Input id="transactionId" placeholder="Enter transaction ID" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} required />
                                     </div>
                                 </CardContent>
                             </Card>
                        </div>
                    )}
                </CardContent>
            </Card>

        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                       <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <Separator className="my-6" />
              <div className="space-y-3">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>৳{cartTotal.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>৳{deliveryCharge.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>৳{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
           <Button type="submit" size="lg" className="mt-6 w-full">
            Place Order
          </Button>
        </div>
      </form>
    </div>
  );
}
