"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Download, FileQuestion, Loader2, Printer, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Logo } from "@/components/logo";
import { useToast } from "@/hooks/use-toast";
import { getOrder } from "@/lib/orders";
import { deliveryOptions, walletNames } from "@/lib/checkout";
import { formatDate, formatPrice } from "@/lib/format";
import { siteConfig } from "@/lib/site";
import type { Order } from "@/types";

export function InvoiceView({ id }: { id: string }) {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    setOrder(getOrder(id) ?? null);
  }, [id]);

  const handleDownloadPdf = async () => {
    if (!invoiceRef.current || !order) return;
    setDownloading(true);
    try {
      // Loaded on demand: these libraries are large and only needed here.
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);
      const canvas = await html2canvas(invoiceRef.current, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const width = pageWidth - margin * 2;
      const height = (canvas.height * width) / canvas.width;
      const imgData = canvas.toDataURL("image/png");
      // Paginate long invoices instead of squashing them onto one page.
      let offset = 0;
      pdf.addImage(imgData, "PNG", margin, margin, width, height);
      while (height - offset > pageHeight - margin * 2) {
        offset += pageHeight - margin * 2;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", margin, margin - offset, width, height);
      }
      pdf.save(`invoice-${order.id}.pdf`);
    } catch {
      toast({ variant: "destructive", title: "Download failed", description: "Try the Print option instead." });
    } finally {
      setDownloading(false);
    }
  };

  if (order === undefined) {
    return (
      <div className="container max-w-3xl py-12">
        <Skeleton className="h-[600px] rounded-xl" />
      </div>
    );
  }

  if (order === null) {
    return (
      <div className="container flex max-w-lg flex-col items-center py-20 text-center">
        <FileQuestion className="h-12 w-12 text-muted-foreground/50" />
        <h1 className="mt-4 text-2xl font-semibold">Invoice not found</h1>
        <p className="mt-2 text-muted-foreground">
          We couldn&apos;t find order <span className="font-mono">{id}</span> on this device. Invoices are stored in the
          browser you ordered from. Please contact us with your order ID if you need a copy.
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

  const zone = deliveryOptions[order.deliveryZone];

  return (
    <div className="bg-muted/40 py-10 sm:py-14 print:bg-white print:py-0">
      <div className="container max-w-3xl">
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-success/30 bg-success/10 p-4 text-sm no-print">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-success" />
          <p>
            Thank you, <strong>{order.customer.name}</strong>! Your order has been received. We&apos;ll verify your payment
            and call you at <strong>{order.customer.phone}</strong> to confirm.
          </p>
        </div>

        <Card className="overflow-hidden shadow-lg print:shadow-none" ref={invoiceRef} data-testid="invoice">
          <CardHeader className="border-b bg-secondary/50">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <Logo />
              <div className="sm:text-right">
                <h1 className="text-2xl font-bold">Invoice</h1>
                <p className="font-mono text-sm text-muted-foreground">{order.id}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Billed to</h2>
                <address className="space-y-0.5 text-sm not-italic">
                  <p className="font-semibold" data-testid="invoice-customer">{order.customer.name}</p>
                  <p>{order.customer.address}</p>
                  <p>{order.customer.city}</p>
                  <p>{order.customer.phone}</p>
                  {order.customer.email && <p>{order.customer.email}</p>}
                </address>
              </div>
              <div className="sm:text-right">
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Order details</h2>
                <div className="space-y-1 text-sm">
                  <p>Date: {formatDate(order.createdAt)}</p>
                  <p>Delivery: {zone.name} ({zone.time})</p>
                  <p>
                    Payment: {order.payment.method === "cod" ? "Cash on Delivery" : "Paid in full"} ·{" "}
                    {walletNames[order.payment.wallet]}
                  </p>
                  <p>
                    TrxID: <span className="font-mono">{order.payment.transactionId}</span>
                  </p>
                  <div className="flex items-center gap-2 sm:justify-end">
                    <span>Status:</span>
                    <Badge variant="secondary" className="bg-gold/20 text-foreground hover:bg-gold/20">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-center">Qty</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatPrice(item.price)}</TableCell>
                      <TableCell className="text-right">{formatPrice(item.price * item.quantity)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 flex justify-end">
              <dl className="w-full max-w-xs space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd>{formatPrice(order.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Delivery</dt>
                  <dd>{formatPrice(order.deliveryCharge)}</dd>
                </div>
                <div className="flex justify-between border-t pt-2 text-base font-bold">
                  <dt>Total</dt>
                  <dd data-testid="invoice-total">{formatPrice(order.total)}</dd>
                </div>
                <div className="flex justify-between text-success">
                  <dt>Paid ({walletNames[order.payment.wallet]})</dt>
                  <dd>{formatPrice(order.payment.paidAmount)}</dd>
                </div>
                <div className="flex justify-between font-semibold">
                  <dt>Due on delivery</dt>
                  <dd>{formatPrice(order.payment.dueOnDelivery)}</dd>
                </div>
              </dl>
            </div>

            {order.customer.notes && (
              <p className="mt-6 rounded-lg bg-muted p-3 text-sm">
                <span className="font-semibold">Notes:</span> {order.customer.notes}
              </p>
            )}

            <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
              <p>Thank you for shopping with {siteConfig.name}!</p>
              <p>
                Questions? {siteConfig.supportPhone} · {siteConfig.supportEmail}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex flex-wrap justify-center gap-3 no-print">
          <Button onClick={handleDownloadPdf} disabled={downloading}>
            {downloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Download PDF
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button asChild variant="ghost">
            <Link href="/shop">
              <ShoppingCart className="mr-2 h-4 w-4" /> Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
