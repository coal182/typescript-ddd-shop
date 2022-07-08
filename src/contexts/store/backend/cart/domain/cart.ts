import { AggregateRoot } from '@core/aggregate-root';

import { CartItem } from './cart-item';
import { CartCreated } from './events/cart-created';
import { CartItemAdded } from './events/cart-item-added';
import { CartItemRemoved } from './events/cart-item-removed';

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
