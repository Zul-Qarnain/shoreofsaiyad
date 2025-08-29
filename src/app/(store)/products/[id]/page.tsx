"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product, Review } from "@/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronUp, ChevronDown, Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { useCart } from "@/providers/cart-provider";
import { useToast } from "@/hooks/use-toast";
import { notFound, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";

// Mock data - in a real app, you'd fetch this
const mockProducts: Product[] = [
    { id: '5', name: 'Elegant Necklace', price: 55.00, imageUrl: 'https://picsum.photos/600/600', description: 'A timeless piece for any occasion. Made from the finest materials, this necklace is sure to make a statement.', stock: 8, dataAiHint: 'necklace jewelry', category: 'Jewelry', material: 'Silver-plated alloy', care: 'Avoid contact with water and perfume.' },
    { id: '4', name: 'Sparkling Hair Clip', price: 12.00, imageUrl: 'https://picsum.photos/600/601', description: 'Add a touch of glamour to your style. Perfect for weddings, proms, or any special event.', stock: 30, dataAiHint: 'hair clip', category: 'Accessories', material: 'Metal alloy with crystals', care: 'Wipe clean with a soft cloth.' },
    { id: '3', name: 'Handcrafted Ceramic Mug', price: 25.00, imageUrl: 'https://picsum.photos/600/602', description: 'Each mug is uniquely crafted by skilled artisans, ensuring no two are exactly alike. Made from high-quality ceramic, these mugs are both beautiful and durable, perfect for enjoying your favorite beverages.', stock: 20, dataAiHint: 'ceramic mug', category: 'Handcrafted Mugs', material: 'High-quality ceramic', care: 'Dishwasher and microwave safe' },
    { id: '6', name: 'Small Gift Set', price: 18.75, imageUrl: 'https://picsum.photos/600/603', description: 'Perfect for any celebration. This set includes a variety of our most popular small souvenirs.', stock: 25, dataAiHint: 'gift box', category: 'Gifts', material: 'Varies', care: 'N/A' },
    { id: '1', name: 'Venetian Mask', price: 45.00, imageUrl: 'https://picsum.photos/600/400', description: 'An ornate Venetian mask, perfect for masquerade balls or as a stunning decorative piece.', stock: 10, dataAiHint: 'venetian mask', category: 'Decor', material: 'Paper-mache', care: 'Handle with care. Do not get wet.' },
    { id: '2', name: 'Eiffel Tower Replica', price: 25.50, imageUrl: 'https://picsum.photos/600/401', description: 'A classic Paris souvenir. This detailed replica is a perfect memento of your trip.', stock: 15, dataAiHint: 'eiffel tower', category: 'Replicas', material: 'Metal', care: 'Dust occasionally.' },
    { id: '7', name: 'Matryoshka Nesting Dolls', price: 42.00, imageUrl: 'https://picsum.photos/600/406', description: 'A set of traditional Russian nesting dolls, hand-painted with intricate designs.', stock: 12, dataAiHint: 'nesting dolls', category: 'Toys', material: 'Wood', care: 'Keep dry.' },
    { id: '8', name: 'Egyptian Papyrus Art', price: 28.00, imageUrl: 'https://picsum.photos/600/407', description: 'Authentic, hand-painted papyrus art featuring traditional Egyptian motifs.', stock: 18, dataAiHint: 'papyrus art', category: 'Art', material: 'Papyrus', care: 'Keep away from direct sunlight.' },
];

const mockReviews: Review[] = [
    { id: '1', author: 'Sophia Clark', avatarUrl: 'https://picsum.photos/100/100', date: '2 months ago', rating: 5, text: "Absolutely love my new mug! The craftsmanship is superb, and it's the perfect size for my morning coffee. Highly recommend!", likes: 12, dislikes: 2 },
    { id: '2', author: 'Ethan Miller', avatarUrl: 'https://picsum.photos/101/101', date: '3 months ago', rating: 4, text: "Beautiful mug, but the handle is a bit smaller than expected. Still, it's a lovely addition to my collection.", likes: 8, dislikes: 1 },
];

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const product = mockProducts.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} has been added to your cart.`,
    });
  };

  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, product.stock));
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };


  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <nav className="text-sm text-muted-foreground">
          <Link href="/shop" className="hover:text-primary">Products</Link>
          <span className="mx-2">/</span>
          <span>{product.category}</span>
        </nav>
      </div>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <div className="aspect-square relative w-full overflow-hidden rounded-lg shadow-lg">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              data-ai-hint={product.dataAiHint}
            />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{product.name}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{product.description}</p>
          <p className="mt-2 text-sm text-muted-foreground">Available in various colors and designs</p>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold">Product Details</h2>
            <Separator className="my-4" />
            <div className="space-y-4 text-muted-foreground">
                <div className="flex justify-between">
                    <span className="font-medium text-foreground">Price</span>
                    <span>${product.price.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="font-medium text-foreground">Material</span>
                    <span>{product.material || 'N/A'}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="font-medium text-foreground">Care Instructions</span>
                    <span>{product.care || 'N/A'}</span>
                </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-medium text-foreground">Quantity</h3>
            <div className="mt-2 flex items-center">
              <div className="relative flex max-w-[150px] items-center">
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                      const value = Math.max(1, Math.min(product.stock, Number(e.target.value)));
                      setQuantity(value);
                  }}
                  className="pr-10 text-center"
                  min="1"
                  max={product.stock}
                />
                 <div className="absolute right-2 flex flex-col items-center">
                    <button onClick={increaseQuantity} className="p-0.5 text-muted-foreground hover:text-foreground"><ChevronUp className="h-4 w-4" /></button>
                    <button onClick={decreaseQuantity} className="p-0.5 text-muted-foreground hover:text-foreground"><ChevronDown className="h-4 w-4" /></button>
                 </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
             <Button onClick={handleAddToCart} size="lg" className="w-full">Add to Cart</Button>
          </div>
        </div>
      </div>
       <div className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight">Customer Reviews</h2>
        <div className="mt-6 space-y-8">
            {mockReviews.map(review => (
                <div key={review.id} className="flex gap-4">
                    <Avatar>
                        <AvatarImage src={review.avatarUrl} alt={review.author} />
                        <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold">{review.author}</p>

                                <p className="text-sm text-muted-foreground">{review.date}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`h-5 w-5 ${i < review.rating ? 'text-primary fill-current' : 'text-muted-foreground/50'}`} />
                                ))}
                            </div>
                        </div>
                        <p className="mt-4 text-muted-foreground">{review.text}</p>
                        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                            <button className="flex items-center gap-1.5 hover:text-primary">
                                <ThumbsUp className="h-4 w-4" /> {review.likes}
                            </button>
                             <button className="flex items-center gap-1.5 hover:text-destructive">
                                <ThumbsDown className="h-4 w-4" /> {review.dislikes}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
