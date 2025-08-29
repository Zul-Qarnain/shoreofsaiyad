import { ProductCard } from "@/components/product-card";
import type { Product } from "@/types";

const mockProducts: Product[] = [
    { id: '1', name: 'Venetian Mask', price: 45.00, imageUrl: 'https://picsum.photos/600/400', description: '...', stock: 10, dataAiHint: 'venetian mask' },
    { id: '2', name: 'Eiffel Tower Replica', price: 25.50, imageUrl: 'https://picsum.photos/600/401', description: '...', stock: 15, dataAiHint: 'eiffel tower' },
    { id: '3', name: 'Japanese Kokeshi Doll', price: 35.00, imageUrl: 'https://picsum.photos/600/402', description: '...', stock: 20, dataAiHint: 'kokeshi doll' },
    { id: '4', name: 'Handwoven Hair Clip', price: 12.00, imageUrl: 'https://picsum.photos/600/403', description: '...', stock: 30, dataAiHint: 'hair clip' },
    { id: '5', name: 'Silver Charm Necklace', price: 55.00, imageUrl: 'https://picsum.photos/600/404', description: '...', stock: 8, dataAiHint: 'charm necklace' },
    { id: '6', name: 'Miniature Windmill', price: 18.75, imageUrl: 'https://picsum.photos/600/405', description: '...', stock: 25, dataAiHint: 'windmill model' },
    { id: '7', name: 'Matryoshka Nesting Dolls', price: 42.00, imageUrl: 'https://picsum.photos/600/406', description: '...', stock: 12, dataAiHint: 'nesting dolls' },
    { id: '8', name: 'Egyptian Papyrus Art', price: 28.00, imageUrl: 'https://picsum.photos/600/407', description: '...', stock: 18, dataAiHint: 'papyrus art' },
];

export default function ShopPage() {
  return (
    <div className="container mx-auto px-4 py-16 sm:py-24">
      <h1 className="mb-10 text-center font-headline text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Our Collection
      </h1>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {mockProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
