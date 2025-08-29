
export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  stock: number;
  dataAiHint?: string;
  category: string;
  material?: string;
  care?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Review {
  id: string;
  author: string;
  avatarUrl: string;
  date: string;
  rating: number;
  text: string;
  likes: number;
  dislikes: number;
}
