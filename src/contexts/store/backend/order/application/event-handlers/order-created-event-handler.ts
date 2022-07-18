import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';

import { TYPES } from '@constants/types';
import { ICommandBus } from '@core/i-command-bus';
import { IEventHandler } from '@core/i-event-handler';
import { OrderCreated } from '@storeback/order/domain/events/order-created';

@injectable()
export class OrderCreatedEventHandler implements IEventHandler<OrderCreated> {
  public event: string = OrderCreated.name;

  constructor(
    @inject(TYPES.CommandBus) private readonly commandBus: ICommandBus,
    @inject(TYPES.Db) private readonly db: Db
  ) {}

  async handle(event: OrderCreated) {
    await this.db.collection('orders').insertOne({
      id: event.guid,
      userId: event.userId,
      items: [],
      version: event.version,
    });
  }
}
