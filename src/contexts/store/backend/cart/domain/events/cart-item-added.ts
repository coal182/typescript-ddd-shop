import { Event } from '@core/event';
import { IEvent } from '@core/i-event';

import { CartItem } from '../cart-item';

export class CartItemAdded extends Event implements IEvent {
  eventName = CartItemAdded.name;
  aggregateName = 'cart';

  constructor(public guid: string, public item: CartItem) {
    super();
  }
}
