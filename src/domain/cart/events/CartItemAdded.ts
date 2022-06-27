import { Event } from '@core/Event';
import { IEvent } from '@core/IEvent';

import { CartItem } from '../CartItem';

export class CartItemAdded extends Event implements IEvent {
  eventName = CartItemAdded.name;
  aggregateName = 'cart';

  constructor(public guid: string, public item: CartItem) {
    super();
  }
}
