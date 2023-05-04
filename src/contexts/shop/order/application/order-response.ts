import { ProductResponse } from '@storeback/product/application/product-response';

import { Order } from '../domain/order';

export interface OrderResponse {
  id: string;
  userId: string;
  status: string;
  name: string;
  address: string;
  total: number;
  lines: Array<{ productId: string; qty: number; price: number; product?: ProductResponse }>;
}

export class OrdersResponse {
  public readonly orders: Array<OrderResponse>;

  constructor(orders: Array<Order>) {
    this.orders = orders.map((order) => {
      const primitives = order.toPrimitives();
      return {
        id: primitives.id,
        userId: primitives.userId,
        status: primitives.status,
        name: primitives.name,
        address: primitives.address,
        total: primitives.total,
        lines: primitives.lines,
      };
    });
  }
}
