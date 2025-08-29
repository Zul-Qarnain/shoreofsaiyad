
export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  stock: number;
  dataAiHint?: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}
