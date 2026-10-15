import type { Product, Review } from "@/types";

/**
 * Product catalog. This is the single source of truth for product data;
 * swap this module for a database/CMS query when a backend is added.
 */
export const products: Product[] = [
  {
    id: "5",
    name: "Elegant Necklace",
    price: 55.0,
    compareAtPrice: 65.0,
    imageUrl: "https://picsum.photos/seed/sos-necklace/600/600",
    description:
      "A timeless piece for any occasion. Made from the finest materials, this necklace is sure to make a statement.",
    stock: 8,
    dataAiHint: "necklace jewelry",
    category: "Jewelry",
    material: "Silver-plated alloy",
    care: "Avoid contact with water and perfume.",
    featured: true,
  },
  {
    id: "4",
    name: "Sparkling Hair Clip",
    price: 12.0,
    imageUrl: "https://picsum.photos/seed/sos-hairclip/600/600",
    description:
      "Add a touch of glamour to your style. Perfect for weddings, proms, or any special event.",
    stock: 30,
    dataAiHint: "hair clip",
    category: "Accessories",
    material: "Metal alloy with crystals",
    care: "Wipe clean with a soft cloth.",
    featured: true,
  },
  {
    id: "3",
    name: "Handcrafted Ceramic Mug",
    price: 25.0,
    imageUrl: "https://picsum.photos/seed/sos-mug/600/600",
    description:
      "Each mug is uniquely crafted by skilled artisans, ensuring no two are exactly alike. Made from high-quality ceramic, these mugs are both beautiful and durable, perfect for enjoying your favorite beverages.",
    stock: 20,
    dataAiHint: "ceramic mug",
    category: "Handcrafted Mugs",
    material: "High-quality ceramic",
    care: "Dishwasher and microwave safe.",
    featured: true,
  },
  {
    id: "6",
    name: "Small Gift Set",
    price: 18.75,
    imageUrl: "https://picsum.photos/seed/sos-giftset/600/600",
    description:
      "Perfect for any celebration. This set includes a variety of our most popular small souvenirs.",
    stock: 25,
    dataAiHint: "gift box",
    category: "Gifts",
    material: "Varies",
    care: "See individual items.",
    featured: true,
  },
  {
    id: "1",
    name: "Venetian Mask",
    price: 45.0,
    imageUrl: "https://picsum.photos/seed/sos-mask/600/600",
    description:
      "An ornate Venetian mask, perfect for masquerade balls or as a stunning decorative piece.",
    stock: 10,
    dataAiHint: "venetian mask",
    category: "Decor",
    material: "Paper-mache",
    care: "Handle with care. Do not get wet.",
  },
  {
    id: "2",
    name: "Eiffel Tower Replica",
    price: 25.5,
    imageUrl: "https://picsum.photos/seed/sos-eiffel/600/600",
    description: "A classic Paris souvenir. This detailed replica is a perfect memento of your trip.",
    stock: 15,
    dataAiHint: "eiffel tower",
    category: "Replicas",
    material: "Metal",
    care: "Dust occasionally.",
  },
  {
    id: "7",
    name: "Matryoshka Nesting Dolls",
    price: 42.0,
    imageUrl: "https://picsum.photos/seed/sos-dolls/600/600",
    description: "A set of traditional Russian nesting dolls, hand-painted with intricate designs.",
    stock: 0,
    dataAiHint: "nesting dolls",
    category: "Toys",
    material: "Wood",
    care: "Keep dry.",
  },
  {
    id: "8",
    name: "Egyptian Papyrus Art",
    price: 28.0,
    imageUrl: "https://picsum.photos/seed/sos-papyrus/600/600",
    description: "Authentic, hand-painted papyrus art featuring traditional Egyptian motifs.",
    stock: 3,
    dataAiHint: "papyrus art",
    category: "Art",
    material: "Papyrus",
    care: "Keep away from direct sunlight.",
  },
];

export const reviews: Review[] = [
  { id: "r1", productId: "3", author: "Sophia Clark", date: "2025-06-12", rating: 5, text: "Absolutely love my new mug! The craftsmanship is superb, and it's the perfect size for my morning coffee. Highly recommend!", likes: 12, dislikes: 2 },
  { id: "r2", productId: "3", author: "Ethan Miller", date: "2025-05-03", rating: 4, text: "Beautiful mug, but the handle is a bit smaller than expected. Still, it's a lovely addition to my collection.", likes: 8, dislikes: 1 },
  { id: "r3", productId: "5", author: "Nusrat Jahan", date: "2025-07-21", rating: 5, text: "Bought this for my mother and she adores it. The finish looks far more expensive than the price.", likes: 15, dislikes: 0 },
  { id: "r4", productId: "4", author: "Tasnim Akter", date: "2025-07-02", rating: 4, text: "Pretty and sturdy. Wore it to a wedding and got lots of compliments.", likes: 6, dislikes: 1 },
];

export const LOW_STOCK_THRESHOLD = 5;

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getCategories(): string[] {
  return Array.from(new Set(products.map((p) => p.category))).sort();
}

export function getReviewsForProduct(productId: string): Review[] {
  return reviews.filter((r) => r.productId === productId);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameCategory = products.filter((p) => p.id !== product.id && p.category === product.category);
  const others = products.filter((p) => p.id !== product.id && p.category !== product.category);
  return [...sameCategory, ...others].slice(0, limit);
}

export type SortOption = "featured" | "price-asc" | "price-desc" | "name";

export interface ProductFilters {
  query?: string;
  category?: string;
  sort?: SortOption;
  inStockOnly?: boolean;
}

/** Pure filter/sort used by the shop page; keeps the original catalog order for "featured". */
export function filterProducts(list: Product[], filters: ProductFilters): Product[] {
  const query = filters.query?.trim().toLowerCase();
  let result = list.filter((p) => {
    if (filters.category && p.category !== filters.category) return false;
    if (filters.inStockOnly && p.stock <= 0) return false;
    if (query) {
      const haystack = `${p.name} ${p.category} ${p.description} ${p.material ?? ""}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });

  switch (filters.sort) {
    case "price-asc":
      result = [...result].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result = [...result].sort((a, b) => b.price - a.price);
      break;
    case "name":
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      result = [...result].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  }
  return result;
}

export function averageRating(list: Review[]): number {
  if (list.length === 0) return 0;
  return list.reduce((acc, r) => acc + r.rating, 0) / list.length;
}
