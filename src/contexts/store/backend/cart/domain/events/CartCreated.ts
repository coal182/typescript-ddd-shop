import { Event } from '@core/Event';
import { IEvent } from '@core/IEvent';

export class CartCreated extends Event implements IEvent {
  eventName = CartCreated.name;
  aggregateName = 'cart';

  constructor(public guid: string, public userId: string) {
    super();
  }
}
