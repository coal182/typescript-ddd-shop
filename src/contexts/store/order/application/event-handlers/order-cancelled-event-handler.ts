import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';

import { TYPES } from '@storeback/shared/constants/types';
import { IEventHandler } from '@core/i-event-handler';
import { OrderCancelled } from '@storeback/order/domain/events/order-cancelled';

@injectable()
export class OrderCancelledEventHandler implements IEventHandler<OrderCancelled> {
  public event = OrderCancelled.name;

  constructor(@inject(TYPES.Db) private readonly db: Db) {}

  async handle(event: OrderCancelled) {
    const order = await this.db.collection('orders').findOne({ id: event.guid });

    if (order) {
      await this.db
        .collection('orders')
        .updateOne({ id: event.guid }, { $set: { status: event.status, version: event.version } });
    }
  }
}
