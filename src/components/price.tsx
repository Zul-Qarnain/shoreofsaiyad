import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Price({
  price,
  compareAtPrice,
  className,
}: {
  price: number;
  compareAtPrice?: number;
  className?: string;
}) {
  const onSale = compareAtPrice !== undefined && compareAtPrice > price;
  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span className="font-bold text-foreground">{formatPrice(price)}</span>
      {onSale && <span className="text-sm text-muted-foreground line-through">{formatPrice(compareAtPrice)}</span>}
    </span>
  );
}
