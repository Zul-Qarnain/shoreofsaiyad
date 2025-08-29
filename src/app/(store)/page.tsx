import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/types";
import Link from "next/link";

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Venetian Mask",
    price: 45.0,
    imageUrl: "https://picsum.photos/600/400",
    description: "An ornate Venetian mask, perfect for masquerade balls or as a decorative piece.",
    stock: 10,
    dataAiHint: "venetian mask",
  },
  {
    id: "2",
    name: "Eiffel Tower Replica",
    price: 25.5,
    imageUrl: "https://picsum.photos/600/401",
    description: "A detailed metal replica of the Eiffel Tower, a classic Paris souvenir.",
    stock: 15,
    dataAiHint: "eiffel tower",
  },
  {
    id: "3",
    name: "Japanese Kokeshi Doll",
    price: 35.0,
    imageUrl: "https://picsum.photos/600/402",
    description: "A traditional wooden Kokeshi doll, handcrafted in Japan.",
    stock: 20,
    dataAiHint: "kokeshi doll",
  },
  {
    id: "4",
    name: "Handwoven Hair Clip",
    price: 12.0,
    imageUrl: "https://picsum.photos/600/403",
    description: "A beautiful hair clip with intricate handwoven patterns.",
    stock: 30,
    dataAiHint: "hair clip",
  },
  {
    id: "5",
    name: "Silver Charm Necklace",
    price: 55.0,
    imageUrl: "https://picsum.photos/600/404",
    description: "An elegant silver necklace with various symbolic charms.",
    stock: 8,
    dataAiHint: "charm necklace",
  },
  {
    id: "6",
    name: "Miniature Windmill",
    price: 18.75,
    imageUrl: "https://picsum.photos/600/405",
    description: "A charming miniature Dutch windmill, a delightful keepsake.",
    stock: 25,
    dataAiHint: "windmill model",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative bg-gradient-to-br from-slate-50 to-blue-100 py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Beautiful Souvenirs for Your Special Moments
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Discover unique keepsakes and gifts from around the world. Each item
            tells a story, waiting to become a part of yours.
          </p>
          <div className="mt-10">
            <Button asChild size="lg">
              <Link href="/shop">Shop Now</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="products" className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center font-headline text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {mockProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
