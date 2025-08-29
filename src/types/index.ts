export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  stock: number;
  dataAiHint?: string;
}

export interface CartItem extends Product {
  quantity: number;
}
