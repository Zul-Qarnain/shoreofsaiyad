export default function ReturnPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="prose prose-lg mx-auto max-w-full rounded-lg bg-card p-8 shadow-sm">
        <h1 className="text-center font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Return Policy
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          At Memento, we want you to be completely satisfied with your purchase. Every product is packed and delivered with utmost care, but we understand that issues may occasionally occur. Please read our return policy carefully:
        </p>

        <h2 className="mt-10 font-headline text-2xl font-bold text-foreground">
          1. Eligibility for Returns
        </h2>
        <p className="text-muted-foreground">
          1.1 Returns are accepted under the following conditions:
        </p>
        <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
          <li>The product has a manufacturing defect or damage.</li>
          <li>You have a genuine personal reason for returning the product.</li>
        </ul>

        <h2 className="mt-8 font-headline text-2xl font-bold text-foreground">
          2. Inspection at Delivery
        </h2>
        <p className="text-muted-foreground">
          2.1 Customers must check the product in front of the delivery rider at the time of delivery.
        </p>
        <p className="text-muted-foreground">
          2.2 If you find any issue or wish to return the item, you must inform the rider immediately or contact us while the rider is still present.
        </p>

        <h2 className="mt-8 font-headline text-2xl font-bold text-foreground">
          3. Return Charges
        </h2>
        <p className="text-muted-foreground">
          3.1 If the return is requested due to a product defect, we will bear the return delivery charge.
        </p>
        <p className="text-muted-foreground">
          3.2 If the return is requested for personal reasons, the delivery charge must be paid by the customer.
        </p>

        <h2 className="mt-8 font-headline text-2xl font-bold text-foreground">
          4. Non-Returnable Conditions
        </h2>
        <p className="text-muted-foreground">
          4.1 Returns will not be accepted if:
        </p>
        <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
          <li>The product has been used, damaged, or altered after delivery.</li>
          <li>The issue is reported after the delivery rider has left.</li>
          <li>The product is returned without proper reason or against our stated policies.</li>
        </ul>

        <h2 className="mt-8 font-headline text-2xl font-bold text-foreground">
          5. Return Process
        </h2>
        <p className="text-muted-foreground">
          5.1 Once your return request is approved, we will guide you through the steps for returning the item.
        </p>
        <p className="text-muted-foreground">
          5.2 Refunds, exchanges, or replacements will be processed only after we receive and verify the returned product.
        </p>

        <p className="mt-10 text-center text-lg font-semibold">
          🌸 We always aim to make your shopping experience safe and worry-free. Thank you for choosing Memento! 🌸
        </p>
      </div>
    </div>
  );
}