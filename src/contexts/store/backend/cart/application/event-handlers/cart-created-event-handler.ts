import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';

import { TYPES } from '@constants/types';
import { IEventHandler } from '@core/i-event-handler';
import { CartCreated } from '@storeback/cart/domain/events/cart-created';

@injectable()
export class CartCreatedEventHandler implements IEventHandler<CartCreated> {
  public event: string = CartCreated.name;

  constructor(@inject(TYPES.Db) private readonly db: Db) {}

  async handle(event: CartCreated) {
    await this.db.collection('carts').insertOne({
      id: event.guid,
      userId: event.userId,
      items: [],
      version: event.version,
    });
  }
}
