import { AggregateRoot } from '@core/AggregateRoot';

import { CartItem } from './CartItem';
import { CartCreated } from './events/CartCreated';
import { CartItemAdded } from './events/CartItemAdded';
import { CartItemRemoved } from './events/CartItemRemoved';

export class Cart extends AggregateRoot {
  public userId: string;
  private items: Array<CartItem>;

  constructor();

  constructor(guid: string, userId: string);

  constructor(guid?: string, userId?: string) {
    super();
    if (guid && userId) {
      this.applyChange(new CartCreated(guid, userId));
    }
  }

  public addItem(item: CartItem) {
    this.applyChange(new CartItemAdded(this.guid, item));
  }

  public removeItem(item: CartItem) {
    this.applyChange(new CartItemRemoved(this.guid, item));
  }

  applyCartCreated(event: CartCreated) {
    this.guid = event.guid;
    this.userId = event.userId;
    this.items = [];
  }

  public applyCartItemAdded(event: CartItemAdded) {
    this.items.push(event.item);
  }

  public applyCartItemRemoved(event: CartItemRemoved) {
    this.items = this.items.filter((item) => item.bookId != event.item.bookId);
  }
}
