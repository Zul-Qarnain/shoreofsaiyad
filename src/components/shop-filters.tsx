"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SortOption } from "@/lib/products";

interface FilterState {
  query: string;
  category: string;
  sort: SortOption;
  inStockOnly: boolean;
}

const sortLabels: Record<SortOption, string> = {
  featured: "Featured",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  name: "Name (A–Z)",
};

export function ShopFilters({
  categories,
  initial,
  resultCount,
}: {
  categories: string[];
  initial: FilterState;
  resultCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(initial.query);

  // Keep the input in sync when the URL changes from elsewhere (e.g. header search).
  useEffect(() => setQuery(initial.query), [initial.query]);

  const apply = (next: Partial<FilterState>) => {
    const state = { ...initial, query, ...next };
    const params = new URLSearchParams();
    if (state.query.trim()) params.set("q", state.query.trim());
    if (state.category !== "all") params.set("category", state.category);
    if (state.sort !== "featured") params.set("sort", state.sort);
    if (state.inStockOnly) params.set("inStock", "1");
    const qs = params.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  };

  const hasFilters = initial.query || initial.category !== "all" || initial.sort !== "featured" || initial.inStockOnly;

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm" aria-busy={isPending}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <form
          role="search"
          className="relative flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            apply({ query });
          }}
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="pl-9"
            aria-label="Search products"
          />
        </form>
        <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
          <Select value={initial.category} onValueChange={(category) => apply({ category })}>
            <SelectTrigger className="sm:w-44" aria-label="Category">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={initial.sort} onValueChange={(sort) => apply({ sort: sort as SortOption })}>
            <SelectTrigger className="sm:w-48" aria-label="Sort by">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(sortLabels) as SortOption[]).map((s) => (
                <SelectItem key={s} value={s}>
                  {sortLabels[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="col-span-2 flex items-center gap-2 sm:col-span-1">
            <Checkbox
              id="in-stock"
              checked={initial.inStockOnly}
              onCheckedChange={(checked) => apply({ inStockOnly: checked === true })}
            />
            <Label htmlFor="in-stock" className="whitespace-nowrap text-sm">
              In stock only
            </Label>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
        <span data-testid="result-count">
          {resultCount} product{resultCount === 1 ? "" : "s"}
        </span>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery("");
              startTransition(() => router.replace(pathname, { scroll: false }));
            }}
          >
            <X className="mr-1 h-3.5 w-3.5" /> Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
