import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';

import { TYPES } from '@constants/types';
import { ICommandBus } from '@core/ICommandBus';
import { IEventHandler } from '@core/IEventHandler';
import { CartCreated } from '@domain/cart/events/CartCreated';

@injectable()
export class CartCreatedEventHandler implements IEventHandler<CartCreated> {
  public event: string = CartCreated.name;

  constructor(
    @inject(TYPES.CommandBus) private readonly commandBus: ICommandBus,
    @inject(TYPES.Db) private readonly db: Db
  ) {}

  async handle(event: CartCreated) {
    await this.db.collection('carts').insertOne({
      _id: event.guid,
      userId: event.userId,
      items: [],
      version: event.version,
    });
  }
}
