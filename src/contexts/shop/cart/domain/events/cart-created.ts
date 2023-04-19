import { Event } from '@core/event';
import { IEvent } from '@core/i-event';

export class CartCreated extends Event implements IEvent {
  eventName = CartCreated.name;
  aggregateName = 'cart';

  constructor(public guid: string, public userId: string) {
    super();
  }
}
