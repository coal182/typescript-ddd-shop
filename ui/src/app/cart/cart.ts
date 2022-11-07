import { Product } from '../products/products';

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  version: number;
}

export interface SessionCart {
  id: string;
  userId: string;
  version: number;
}

export interface CartItem {
  product: Product;
  qty: number;
  price: number;
}

export interface AddToCartParams {
  guid: string;
  bookId: string;
  qty: number;
  price: number;
  originalVersion: number;
}
