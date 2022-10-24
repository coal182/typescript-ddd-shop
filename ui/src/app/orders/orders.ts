import { Product } from '../products/products';
export interface Order {
  id: string;
  userId: string;
  status: string;
  name: string;
  address: string;
  total: number;
  items: Array<OrderLine>;
  version: number;
}

export interface OrderLine {
  product: Product;
  qty: number;
  price: number;
}
