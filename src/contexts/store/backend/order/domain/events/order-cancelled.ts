import { Event } from '@core/event';
import { IEvent } from '@core/i-event';

import { OrderStatusEnum } from '../order-status';

export class OrderCancelled extends Event implements IEvent {
  eventName = OrderCancelled.name;
  aggregateName = 'order';

  constructor(public guid: string, public status: OrderStatusEnum) {
    super();
  }
}
