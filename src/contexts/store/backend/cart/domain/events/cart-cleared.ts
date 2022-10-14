import { Event } from '@core/event';
import { IEvent } from '@core/i-event';

export class CartCleared extends Event implements IEvent {
  eventName = CartCleared.name;
  aggregateName = 'cart';

  constructor(public guid: string) {
    super();
  }
}
