import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';

import { TYPES } from '@constants/types';
import { IEventHandler } from '@core/IEventHandler';
import { CartItemAdded } from '@domain/cart/events/CartItemAdded';

@injectable()
export class CartItemAddedEventHandler implements IEventHandler<CartItemAdded> {
  public event = CartItemAdded.name;

  constructor(@inject(TYPES.Db) private readonly db: Db) {}

  async handle(event: CartItemAdded) {
    const cart = await this.db.collection('carts').findOne({ _id: event.guid });
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
        newItems.push(event.item);
      }
      await this.db
        .collection('carts')
        .updateOne({ _id: event.guid }, { $set: { items: newItems, version: event.version } });
    }
  }
}
