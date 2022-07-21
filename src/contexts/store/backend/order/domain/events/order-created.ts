import { Event } from '@core/event';
import { IEvent } from '@core/i-event';

export class OrderCreated extends Event implements IEvent {
  eventName = OrderCreated.name;
  aggregateName = 'order';

  constructor(public guid: string) {
    super();
  }
}
