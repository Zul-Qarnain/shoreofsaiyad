
"use client";

import { useRef } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Mountain, Download, ShoppingCart } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function InvoicePage({ params }: { params: { id: string } }) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const order = {
    id: params.id,
    date: new Date(),
    status: "Confirmed",
    customer: {
      name: "John Doe",
      email: "john@example.com",
      address: "123 Main St, Anytown, USA 12345",
    },
    items: [
      { id: "1", name: "Venetian Mask", quantity: 1, price: 45.0 },
      { id: "2", name: "Eiffel Tower Replica", quantity: 2, price: 25.5 },
    ],
    total: 96.5,
    shipping: 70.0,
    tax: 8.21,
  };

  const handleDownloadPdf = () => {
    const input = invoiceRef.current;
    if (input) {
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 0;
        pdf.addImage(
          imgData,
          "PNG",
          imgX,
          imgY,
          imgWidth * ratio,
          imgHeight * ratio
        );
        pdf.save(`invoice-${order.id}.pdf`);
      });
    }
  };

  const grandTotal = order.total + order.shipping + order.tax;

  return (
    <div className="bg-muted/40 py-12 sm:py-20">
      <div className="container mx-auto max-w-3xl">
        <Card className="shadow-lg" ref={invoiceRef}>
          <CardHeader className="border-b bg-accent/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/" className="flex items-center gap-2" prefetch={false}>
                  <Mountain className="h-8 w-8 text-primary" />
                </Link>
                <div className="grid gap-0.5">
                  <CardTitle className="font-headline text-2xl">Invoice</CardTitle>
                  <CardDescription>Order ID: {order.id}</CardDescription>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">Memento Souvenirs</p>
                <p className="text-sm text-muted-foreground">
                  Your journey, our treasures.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-2 font-semibold">Billed To:</h3>
                <address className="not-italic text-muted-foreground">
                  <p className="font-medium text-foreground">{order.customer.name}</p>
                  <p>{order.customer.address}</p>
                  <p>{order.customer.email}</p>
                </address>
              </div>
              <div className="text-right">
                 <h3 className="mb-2 font-semibold">Order Details:</h3>
                <div className="space-y-1 text-muted-foreground">
                    <p>Date: {order.date.toLocaleDateString()}</p>
                    <div className="flex items-center justify-end gap-2">
                      <span>Status:</span>
                      <Badge variant={order.status === 'Confirmed' ? 'default' : 'secondary'} className="bg-green-100 text-green-800">{order.status}</Badge>
                    </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">৳{item.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        ৳{(item.price * item.quantity).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-8 flex justify-end">
              <div className="w-full max-w-xs space-y-2">
                 <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>৳{order.total.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>৳{order.shipping.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between">
                    <span>Tax</span>
                    <span>৳{order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-lg font-bold">
                    <span>Total</span>
                    <span>৳{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
             <div className="mt-12 text-center text-sm text-muted-foreground">
                <p>Thank you for your order! A confirmation has been sent to your email.</p>
                <p>If you have any questions, please contact us at support@memento.com.</p>
            </div>
          </CardContent>
        </Card>
        <div className="mt-8 flex justify-center gap-4">
          <Button onClick={handleDownloadPdf}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
