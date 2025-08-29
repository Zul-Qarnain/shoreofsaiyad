
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/types";
import Link from "next/link";
import Image from "next/image";

const mockProducts: Product[] = [
  {
    id: "5",
    name: "Elegant Necklace",
    price: 55.0,
    imageUrl: "https://picsum.photos/600/600",
    description: "A timeless piece for any occasion.",
    stock: 8,
    dataAiHint: "necklace jewelry",
    category: "Jewelry",
  },
  {
    id: "4",
    name: "Sparkling Hair Clip",
    price: 12.0,
    imageUrl: "https://picsum.photos/600/601",
    description: "Add a touch of glamour to your style.",
    stock: 30,
    dataAiHint: "hair clip",
    category: "Accessories",
  },
  {
    id: "3",
    name: "Handcrafted Ceramic Mug",
    price: 25.00,
    imageUrl: "https://picsum.photos/600/602",
    description: "Each mug is uniquely crafted by skilled artisans, ensuring no two are exactly alike.",
    stock: 20,
    dataAiHint: "ceramic mug",
    category: "Handcrafted Mugs"
  },
  {
    id: "6",
    name: "Small Gift Set",
    price: 18.75,
    imageUrl: "https://picsum.photos/600/603",
    description: "Perfect for any celebration.",
    stock: 25,
    dataAiHint: "gift box",
    category: "Gifts",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
            <div className="relative aspect-[2/1] md:aspect-[3/1] lg:aspect-[4/1.5] max-w-5xl mx-auto rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10" />
                <Image
                    src="https://picsum.photos/1200/600"
                    alt="Souvenirs background"
                    fill
                    className="object-cover"
                    data-ai-hint="souvenirs decoration"
                />
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white p-4">
                    <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl text-shadow-md">
                        Souvenirs for Special Moments
                    </h1>
                    <p className="mt-4 max-w-xl text-lg text-shadow">
                        Discover unique gifts that capture the essence of your cherished memories.
                    </p>
                    <div className="mt-8">
                        <Button asChild size="lg" className="rounded-full font-bold">
                        <Link href="/shop">Shop Now</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <section id="products" className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {mockProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg" className="rounded-full bg-accent hover:bg-border">
                <Link href="/shop">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
