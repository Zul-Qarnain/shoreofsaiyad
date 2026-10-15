export interface Product {
  id: string;
  name: string;
  price: number;
  /** Original price, shown struck-through when the product is on sale. */
  compareAtPrice?: number;
  imageUrl: string;
  description: string;
  stock: number;
  dataAiHint?: string;
  category: string;
  material?: string;
  care?: string;
  featured?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  date: string;
  rating: number;
  text: string;
  likes: number;
  dislikes: number;
}

export type DeliveryZone = "inside-dhaka" | "sub-dhaka" | "outside-dhaka";
export type PaymentMethod = "cod" | "mobile";
export type MobileWallet = "bkash" | "nagad";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  createdAt: string;
  status: "Pending Verification" | "Confirmed";
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    notes?: string;
  };
  items: OrderItem[];
  deliveryZone: DeliveryZone;
  payment: {
    method: PaymentMethod;
    wallet: MobileWallet;
    transactionId: string;
    /** Amount already paid online (delivery charge for COD, full total otherwise). */
    paidAmount: number;
    /** Amount the customer pays the rider on delivery. */
    dueOnDelivery: number;
  };
  subtotal: number;
  deliveryCharge: number;
  total: number;
}
