import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, LogOut, Package, PackageX, Sparkles } from "lucide-react";
import { logout } from "@/app/admin/actions";
import { DescriptionGenerator } from "@/components/admin/description-generator";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StockBadge } from "@/components/stock-badge";
import { getCategories, LOW_STOCK_THRESHOLD, products } from "@/lib/products";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminPage() {
  const outOfStock = products.filter((p) => p.stock <= 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD);
  const inventoryValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);

  const stats = [
    { label: "Products", value: products.length, Icon: Package },
    { label: "Low stock", value: lowStock.length, Icon: AlertTriangle },
    { label: "Sold out", value: outOfStock.length, Icon: PackageX },
    { label: "Inventory value", value: formatPrice(inventoryValue), Icon: Sparkles },
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

        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
              <CardDescription>Catalog is defined in src/lib/products.ts.</CardDescription>
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
      </main>
    </div>
  );
}
