import { Product } from '../products/products';

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

export interface SessionCart {
  id: string;
  userId: string;
}

export interface CartItem {
  product: Product;
  qty: number;
  price: number;
}

export interface AddToCartParams {
  id: string;
  productId: string;
  qty: number;
  price: number;
}
