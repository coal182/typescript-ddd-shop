import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';

import { TYPES } from '@storeback/shared/constants/types';
import { IEventHandler } from '@core/i-event-handler';
import { OrderInitiated } from '@storeback/order/domain/events/order-initiated';

@injectable()
export class OrderInitiatedEventHandler implements IEventHandler<OrderInitiated> {
  public event: string = OrderInitiated.name;

  constructor(@inject(TYPES.Db) private readonly db: Db) {}

  async handle(event: OrderInitiated) {
    // nothing to do in this step
  }
}
