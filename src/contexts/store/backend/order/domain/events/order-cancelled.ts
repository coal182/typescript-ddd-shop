import { Event } from '@core/event';
import { IEvent } from '@core/i-event';

import { OrderStatus } from '../order';

export class OrderCancelled extends Event implements IEvent {
  eventName = OrderCancelled.name;
  aggregateName = 'order';

  constructor(public guid: string, public status: OrderStatus) {
    super();
  }
}
