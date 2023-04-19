import { Event } from '@core/event';
import { IEvent } from '@core/i-event';

import { CartItem } from '../cart-item';

export class CartItemRemoved extends Event implements IEvent {
  eventName = CartItemRemoved.name;
  aggregateName = 'cart';

  constructor(public guid: string, public item: CartItem) {
    super();
  }
}
