import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';

import { TYPES } from '@constants/types';
import { IEventHandler } from '@core/i-event-handler';
import { CartItem } from '@storeback/cart/domain/cart-item';
import { CartItemRemoved } from '@storeback/cart/domain/events/cart-item-removed';

@injectable()
export class CartItemRemovedEventHandler implements IEventHandler<CartItemRemoved> {
  public event = CartItemRemoved.name;

  constructor(@inject(TYPES.Db) private readonly db: Db) {}

  async handle(event: CartItemRemoved) {
    const cart = await this.db.collection('carts').findOne({ id: event.guid });

    if (cart) {
      const newItems = cart.items.filter((item: CartItem) => item.bookId != event.item.bookId);

      await this.db
        .collection('carts')
        .updateOne({ id: event.guid }, { $set: { items: newItems, version: event.version } });
    }
  }
}
