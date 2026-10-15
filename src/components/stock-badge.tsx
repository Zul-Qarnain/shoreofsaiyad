import { Badge } from "@/components/ui/badge";
import { LOW_STOCK_THRESHOLD } from "@/lib/products";

export function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) {
    return <Badge variant="secondary" className="bg-muted text-muted-foreground">Sold out</Badge>;
  }
  if (stock <= LOW_STOCK_THRESHOLD) {
    return <Badge className="bg-gold text-gold-foreground hover:bg-gold">Only {stock} left</Badge>;
  }
  return null;
}
