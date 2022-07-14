import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';

import { TYPES } from '@constants/types';
import { IEventHandler } from '@core/i-event-handler';
import { CartItemAdded } from '@storeback/cart/domain/events/cart-item-added';

@injectable()
export class CartItemAddedEventHandler implements IEventHandler<CartItemAdded> {
  public event = CartItemAdded.name;

  constructor(@inject(TYPES.Db) private readonly db: Db) {}

  async handle(event: CartItemAdded) {
    const cart = await this.db.collection('carts').findOne({ id: event.guid });
    if (cart) {
      let newItems = [...cart.items];
      if (newItems.find((item) => item.bookId == event.item.bookId)) {
        newItems = newItems.map((item) => {
          if (item.bookId == event.item.bookId) {
            item.qty += event.item.qty;
            item.price = event.item.price;
          }
          return item;
        });
      } else {
        const book = await this.db.collection('books').findOne({ id: event.item.bookId });
        newItems.push({ ...event.item, product: book });
      }
      await this.db
        .collection('carts')
        .updateOne({ id: event.guid }, { $set: { items: newItems, version: event.version } });
    }
  }
}
