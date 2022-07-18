import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';

import { TYPES } from '@constants/types';
import { IEventHandler } from '@core/i-event-handler';
import { OrderLineAdded } from '@storeback/order/domain/events/order-line-added';

@injectable()
export class OrderLineAddedEventHandler implements IEventHandler<OrderLineAdded> {
  public event = OrderLineAdded.name;

  constructor(@inject(TYPES.Db) private readonly db: Db) {}

  async handle(event: OrderLineAdded) {
    const cart = await this.db.collection('orders').findOne({ id: event.guid });
    if (cart) {
      let newItems = [...cart.lines];
      if (newItems.find((line) => line.bookId == event.line.bookId)) {
        newItems = newItems.map((line) => {
          if (line.bookId == event.line.bookId) {
            line.qty += event.line.qty;
            line.price = event.line.price;
          }
          return line;
        });
      } else {
        const book = await this.db.collection('books').findOne({ id: event.line.bookId });
        newItems.push({ ...event.line, product: book });
      }
      await this.db
        .collection('orders')
        .updateOne({ id: event.guid }, { $set: { lines: newItems, version: event.version } });
    }
  }
}
