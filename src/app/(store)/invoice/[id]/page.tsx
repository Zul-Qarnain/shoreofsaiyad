import type { Metadata } from "next";
import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InvoiceView } from "@/components/invoice-view";
import { getOrderById } from "@/lib/server/store";

export const metadata: Metadata = {
  title: "Invoice",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const id = decodeURIComponent((await params).id);
  const order = await getOrderById(id);

  if (!order) {
    return (
      <div className="container flex max-w-lg flex-col items-center py-20 text-center">
        <FileQuestion className="h-12 w-12 text-muted-foreground/50" />
        <h1 className="mt-4 text-2xl font-semibold">Invoice not found</h1>
        <p className="mt-2 text-muted-foreground">
          We couldn&apos;t find order <span className="font-mono">{id}</span>. Please check the link or contact us with
          your order ID.
        </p>
        <div className="mt-6 flex gap-3">
          <Button asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <InvoiceView order={order} />;
}
