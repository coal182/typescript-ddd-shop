import { Event } from '@core/Event';
import { IEvent } from '@core/IEvent';

import { CartItem } from '../CartItem';

export class CartItemRemoved extends Event implements IEvent {
  eventName = CartItemRemoved.name;
  aggregateName = 'cart';

  constructor(public guid: string, public item: CartItem) {
    super();
  }
}
