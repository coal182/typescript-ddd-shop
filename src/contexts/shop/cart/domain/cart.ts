import { v4 as uuidv4 } from 'uuid';

import { AggregateRoot } from '@shared/domain/aggregate-root';
import { DomainEvent } from '@shared/domain/domain-event';
import { ProductResponse } from '@storeback/product/application/product-response';

import { CartId } from './cart-id';
import { CartItem } from './cart-item';
import { CartUser } from './cart-user';
import { CartCleared } from './events/cart-cleared';
import { CartCreated } from './events/cart-created';
import { CartItemAdded } from './events/cart-item-added';
import { CartItemRemoved } from './events/cart-item-removed';

export class Cart extends AggregateRoot {
  public id: CartId;
  public userId: CartUser;
  public items: Array<CartItem>;

  constructor(id: CartId, userId: CartUser, items: CartItem[] = []) {
    super();
    this.id = id;
    this.userId = userId;
    this.items = items;
  }

  static create(id: CartId, userId: CartUser): Cart {
    const cart = new Cart(id, userId);

    cart.record(
      new CartCreated({
        aggregateId: cart.id.value,
        userId: cart.userId.value,
      })
    );

    return cart;
  }

  static createEmptyCart(id: CartId): Cart {
    const userId = new CartUser(uuidv4());

    return new Cart(id, userId);
  }

  public addItem(item: CartItem) {
    this.items.push(item);
    this.record(new CartItemAdded({ aggregateId: this.id.value, item: item }));
  }

  public removeItem(item: CartItem) {
    this.items = this.items.filter((it) => it.productId != item.productId);
    this.record(new CartItemRemoved({ aggregateId: this.id.value, item: item }));
  }

  public clear() {
    this.items = [];
    this.record(new CartCleared({ aggregateId: this.id.value }));
  }

  applyCartCreated(event: CartCreated) {
    this.id = new CartId(event.aggregateId);
    this.userId = new CartUser(event.userId);
    this.items = [];
  }

  public applyCartItemAdded(event: CartItemAdded) {
    this.items.push(event.item);
  }

  public applyCartItemRemoved(event: CartItemRemoved) {
    this.items = this.items.filter((item) => item.productId != event.item.productId);
  }

  public applyCartCleared(event: CartCleared) {
    this.items = [];
  }

  static fromPrimitives(plainData: {
    id: string;
    userId: string;
    items: Array<{ productId: string; qty: number; price: number; product?: ProductResponse }>;
  }): Cart {
    return new Cart(
      new CartId(plainData.id),
      new CartUser(plainData.userId),
      plainData.items.map((item) => new CartItem(item.productId, item.qty, item.price, item.product))
    );
  }

  toPrimitives() {
    return {
      id: this.id.value,
      userId: this.userId.value,
      items: this.items,
    };
  }

  applyEvent(event: DomainEvent): void {
    /*eslint indent: ["error", 2, {"SwitchCase": 1}]*/
    switch (event.eventName) {
      case 'cart.created':
        this.applyCartCreated(event as CartCreated);
        break;
      case 'cart.item_added':
        this.applyCartItemAdded(event as CartItemAdded);
        break;
      case 'cart.item_removed':
        this.applyCartItemRemoved(event as CartItemRemoved);
        break;
      case 'cart.cleared':
        this.applyCartCleared(event as CartCleared);
        break;
      default:
        throw new Error(`Unsupported event: ${event.eventName}`);
    }
  }
}
