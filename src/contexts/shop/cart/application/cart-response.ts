import { Cart } from '../domain/cart';

export interface CartResponse {
  id: string;
  userId: string;
  items: Array<{ productId: string; qty: number; price: number }>;
}

export class CartsResponse {
  public readonly carts: Array<CartResponse>;

  constructor(carts: Array<Cart>) {
    this.carts = carts.map((cart) => {
      const primitives = cart.toPrimitives();
      return {
        id: primitives.id,
        userId: primitives.userId,
        items: primitives.items,
      };
    });
  }
}
