import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <div className="container py-10 lg:py-14">
      <h1 className="mb-8 text-center text-3xl font-bold tracking-tight sm:text-4xl">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
