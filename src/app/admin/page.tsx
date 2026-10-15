import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, Inbox, LogOut, Mail, ShoppingBag, Sparkles, Wallet } from "lucide-react";
import { logout } from "@/app/admin/actions";
import { DescriptionGenerator } from "@/components/admin/description-generator";
import { MessageReadToggle, OrderStatusActions } from "@/components/admin/order-status-actions";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StockBadge } from "@/components/stock-badge";
import { getCategories, LOW_STOCK_THRESHOLD } from "@/lib/products";
import { deliveryOptions, walletNames } from "@/lib/checkout";
import { formatPrice } from "@/lib/format";
import { getLiveProducts, listMessages, listOrders } from "@/lib/server/store";
import type { OrderStatus } from "@/types";

const statusStyles: Record<OrderStatus, string> = {
  "Pending Verification": "bg-gold/20 text-foreground",
  Confirmed: "bg-primary/15 text-primary",
  Shipped: "bg-secondary text-primary",
  Delivered: "bg-success/15 text-success",
  Cancelled: "bg-destructive/15 text-destructive",
};

const dateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Dhaka" });

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [products, orders, messages] = await Promise.all([getLiveProducts(), listOrders(), listMessages()]);
  const outOfStock = products.filter((p) => p.stock <= 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD);
  const pendingOrders = orders.filter((o) => o.status === "Pending Verification");
  const revenue = orders.filter((o) => o.status !== "Cancelled").reduce((acc, o) => acc + o.total, 0);
  const unread = messages.filter((m) => !m.read);

  const stats = [
    { label: "Awaiting verification", value: pendingOrders.length, Icon: ShoppingBag },
    { label: "Order value (excl. cancelled)", value: formatPrice(revenue), Icon: Wallet },
    { label: "Low / sold out", value: `${lowStock.length} / ${outOfStock.length}`, Icon: AlertTriangle },
    { label: "Unread messages", value: unread.length, Icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-primary">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">View store</Link>
            </Button>
            <form action={logout}>
              <Button type="submit" variant="outline" size="sm">
                <LogOut className="mr-2 h-4 w-4" /> Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="container space-y-8 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ label, value, Icon }) => (
            <Card key={label}>
              <CardContent className="flex items-center gap-4 p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-xl font-bold">{value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>
              Check each Transaction ID in your bKash/Nagad app before confirming. Cancelling returns items to stock.
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {orders.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground" data-testid="no-orders">
                No orders yet.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((o) => (
                    <TableRow key={o.id} data-testid="admin-order">
                      <TableCell className="whitespace-nowrap align-top">
                        <Link href={`/invoice/${o.id}`} className="font-mono text-xs hover:text-primary" target="_blank">
                          {o.id}
                        </Link>
                        <p className="text-xs text-muted-foreground">{dateTime(o.createdAt)}</p>
                      </TableCell>
                      <TableCell className="min-w-[200px] align-top text-sm">
                        <p className="font-medium">{o.customer.name}</p>
                        <a href={`tel:${o.customer.phone}`} className="block hover:text-primary">
                          {o.customer.phone}
                        </a>
                        <p className="text-muted-foreground">
                          {o.customer.address}, {o.customer.city} · {deliveryOptions[o.deliveryZone].name}
                        </p>
                        {o.customer.notes && <p className="mt-1 italic text-muted-foreground">“{o.customer.notes}”</p>}
                      </TableCell>
                      <TableCell className="min-w-[160px] align-top text-sm">
                        {o.items.map((i) => (
                          <p key={i.id}>
                            {i.quantity} × {i.name}
                          </p>
                        ))}
                      </TableCell>
                      <TableCell className="whitespace-nowrap align-top text-sm">
                        <p>
                          {walletNames[o.payment.wallet]} · <span className="font-mono">{o.payment.transactionId}</span>
                        </p>
                        <p className="text-muted-foreground">
                          Paid {formatPrice(o.payment.paidAmount)} · Due {formatPrice(o.payment.dueOnDelivery)}
                        </p>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-right align-top font-semibold">
                        {formatPrice(o.total)}
                      </TableCell>
                      <TableCell className="align-top">
                        <Badge variant="secondary" className={`whitespace-nowrap ${statusStyles[o.status]}`}>
                          {o.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="align-top">
                        <OrderStatusActions orderId={o.id} status={o.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
              <CardDescription>
                Live stock. Product details and starting stock are defined in src/lib/products.ts.
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">
                        <Link href={`/products/${p.id}`} className="hover:text-primary">
                          {p.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{p.category}</TableCell>
                      <TableCell className="text-right">{formatPrice(p.price)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <StockBadge stock={p.stock} />
                          <span>{p.stock}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-gold" /> AI Product Description
              </CardTitle>
              <CardDescription>Generate engaging copy with Gemini, then paste it into the catalog.</CardDescription>
            </CardHeader>
            <CardContent>
              <DescriptionGenerator categories={getCategories()} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Inbox className="h-5 w-5 text-primary" /> Messages
            </CardTitle>
            <CardDescription>Sent from the Contact page.</CardDescription>
          </CardHeader>
          <CardContent>
            {messages.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">No messages yet.</p>
            ) : (
              <ul className="divide-y">
                {messages.map((m) => (
                  <li key={m.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-medium">
                        {!m.read && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary" aria-label="Unread" />}
                        {m.name}{" "}
                        <a href={`mailto:${m.email}`} className="text-sm font-normal text-muted-foreground hover:text-primary">
                          {m.email}
                        </a>
                        {m.phone && <span className="text-sm font-normal text-muted-foreground"> · {m.phone}</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">{dateTime(m.createdAt)}</p>
                      <p className="mt-2 whitespace-pre-wrap break-words text-sm">{m.message}</p>
                    </div>
                    <MessageReadToggle id={m.id} read={m.read} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
