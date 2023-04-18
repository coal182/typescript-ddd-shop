import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';

import { TYPES } from '@storeback/shared/constants/types';
import { IEventHandler } from '@core/i-event-handler';
import { CartItem } from '@storeback/cart/domain/cart-item';
import { CartCleared } from '@storeback/cart/domain/events/cart-cleared';

@injectable()
export class CartClearedEventHandler implements IEventHandler<CartCleared> {
  public event = CartCleared.name;

  constructor(@inject(TYPES.Db) private readonly db: Db) {}

  async handle(event: CartCleared) {
    const cart = await this.db.collection('carts').findOne({ id: event.guid });

    if (cart) {
      const newItems: Array<CartItem> = [];

      await this.db
        .collection('carts')
        .updateOne({ id: event.guid }, { $set: { items: newItems, version: event.version } });
    }
  }
}
