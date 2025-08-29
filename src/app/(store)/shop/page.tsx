import { ProductCard } from "@/components/product-card";
import type { Product } from "@/types";

const mockProducts: Product[] = [
    { id: '5', name: 'Elegant Necklace', price: 55.00, imageUrl: 'https://picsum.photos/600/600', description: 'A timeless piece for any occasion.', stock: 8, dataAiHint: 'necklace jewelry' },
    { id: '4', name: 'Sparkling Hair Clip', price: 12.00, imageUrl: 'https://picsum.photos/600/601', description: 'Add a touch of glamour to your style.', stock: 30, dataAiHint: 'hair clip' },
    { id: '3', name: 'Collectible Doll', price: 35.00, imageUrl: 'https://picsum.photos/600/602', description: 'A charming addition to any collection.', stock: 20, dataAiHint: 'doll toy' },
    { id: '6', name: 'Small Gift Set', price: 18.75, imageUrl: 'https://picsum.photos/600/603', description: 'Perfect for any celebration.', stock: 25, dataAiHint: 'gift box' },
    { id: '1', name: 'Venetian Mask', price: 45.00, imageUrl: 'https://picsum.photos/600/400', description: 'An ornate Venetian mask.', stock: 10, dataAiHint: 'venetian mask' },
    { id: '2', name: 'Eiffel Tower Replica', price: 25.50, imageUrl: 'https://picsum.photos/600/401', description: 'A classic Paris souvenir.', stock: 15, dataAiHint: 'eiffel tower' },
    { id: '7', name: 'Matryoshka Nesting Dolls', price: 42.00, imageUrl: 'https://picsum.photos/600/406', description: 'Traditional Russian nesting dolls.', stock: 12, dataAiHint: 'nesting dolls' },
    { id: '8', name: 'Egyptian Papyrus Art', price: 28.00, imageUrl: 'https://picsum.photos/600/407', description: 'Hand-painted papyrus art.', stock: 18, dataAiHint: 'papyrus art' },
];

export default function ShopPage() {
  return (
    <div className="container mx-auto px-4 py-16 sm:py-24">
      <h1 className="mb-10 text-center text-3xl font-bold tracking-tight sm:text-4xl">
        All Products
      </h1>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {mockProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
