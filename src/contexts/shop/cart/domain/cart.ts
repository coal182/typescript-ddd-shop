import { AggregateRoot } from '@core/aggregate-root';

import { CartId } from './cart-id';
import { CartItem } from './cart-item';
import { CartCleared } from './events/cart-cleared';
import { CartCreated } from './events/cart-created';
import { CartItemAdded } from './events/cart-item-added';
import { CartItemRemoved } from './events/cart-item-removed';

export class Cart extends AggregateRoot {
  public guid: CartId;
  public userId: string;
  private items: Array<CartItem>;

  constructor();

  constructor(guid: CartId, userId: string);

  constructor(guid?: CartId, userId?: string) {
    super();
    if (guid && userId) {
      this.applyChange(new CartCreated(guid.value, userId));
    }
  }

  public addItem(item: CartItem) {
    this.applyChange(new CartItemAdded(this.guid.value, item));
  }

  public removeItem(item: CartItem) {
    this.applyChange(new CartItemRemoved(this.guid.value, item));
  }

  public clear() {
    this.applyChange(new CartCleared(this.guid.value));
  }

  applyCartCreated(event: CartCreated) {
    this.guid = new CartId(event.guid);
    this.userId = event.userId;
    this.items = [];
  }

  public applyCartItemAdded(event: CartItemAdded) {
    this.items.push(event.item);
  }

  public applyCartItemRemoved(event: CartItemRemoved) {
    this.items = this.items.filter((item) => item.bookId != event.item.bookId);
  }

  public applyCartCleared(event: CartCleared) {
    this.items = [];
  }
}
