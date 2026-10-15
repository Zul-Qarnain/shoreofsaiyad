import type { Metadata } from "next";
import { ProductCard } from "@/components/product-card";
import { ShopFilters } from "@/components/shop-filters";
import { filterProducts, getCategories, type SortOption } from "@/lib/products";
import { getLiveProducts } from "@/lib/server/store";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse ornaments, accessories, gift sets and more.",
};

const SORTS: SortOption[] = ["featured", "price-asc", "price-desc", "name"];

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const categories = getCategories();
  const query = first(params.q) ?? "";
  const categoryParam = first(params.category);
  const category = categoryParam && categories.includes(categoryParam) ? categoryParam : undefined;
  const sortParam = first(params.sort) as SortOption | undefined;
  const sort = sortParam && SORTS.includes(sortParam) ? sortParam : "featured";
  const inStockOnly = first(params.inStock) === "1";

  const results = filterProducts(await getLiveProducts(), { query, category, sort, inStockOnly });

  return (
    <div className="container py-12 sm:py-16">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">All Products</h1>
        <p className="mt-2 text-muted-foreground">Find something beautiful for someone special.</p>
      </div>

      <ShopFilters
        categories={categories}
        initial={{ query, category: category ?? "all", sort, inStockOnly }}
        resultCount={results.length}
      />

      {results.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {results.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 4} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center" data-testid="no-results">
          <p className="text-lg font-semibold">No products match your filters.</p>
          <p className="mt-1 text-muted-foreground">Try a different search term or category.</p>
        </div>
      )}
    </div>
  );
}
