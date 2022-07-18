import { Event } from '@core/event';
import { IEvent } from '@core/i-event';

import { OrderLine } from '../order-line';

export class OrderLineAdded extends Event implements IEvent {
  eventName = OrderLineAdded.name;
  aggregateName = 'order';

  constructor(public guid: string, public line: OrderLine) {
    super();
  }
}
