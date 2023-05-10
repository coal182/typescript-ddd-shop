import { Product } from '../../products/interfaces/products.interface';

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
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
