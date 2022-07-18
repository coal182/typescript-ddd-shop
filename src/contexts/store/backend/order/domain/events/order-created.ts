import { Event } from '@core/event';
import { IEvent } from '@core/i-event';

import { OrderStatus } from '../order';

export class OrderCreated extends Event implements IEvent {
  eventName = OrderCreated.name;
  aggregateName = 'cart';

  constructor(
    public guid: string,
    public userId: string,
    public status: OrderStatus,
    public name: string,
    public address: string,
    public total: number
  ) {
    super();
  }
}
