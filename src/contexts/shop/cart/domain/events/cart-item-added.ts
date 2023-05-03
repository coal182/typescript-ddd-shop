import { DomainEvent } from '@shared/domain/domain-event';

import { CartItem } from '../cart-item';

type CartItemAddedDomainEventData = {
  readonly item: CartItem;
};
export class CartItemAdded extends DomainEvent {
  static readonly EVENT_NAME = 'cart.item_added';

  readonly item: CartItem;

  constructor({
    aggregateId,
    item,
    eventId,
    occurredOn,
  }: {
    aggregateId: string;
    item: CartItem;
    eventId?: string;
    occurredOn?: Date;
  }) {
    super({ eventName: CartItemAdded.EVENT_NAME, aggregateId, eventId, occurredOn });
    this.item = item;
  }

  toPrimitives(): CartItemAddedDomainEventData {
    const { item } = this;
    return {
      item,
    };
  }

  static fromPrimitives(params: {
    aggregateId: string;
    data: CartItemAddedDomainEventData;
    eventId: string;
    occurredOn: Date;
  }): DomainEvent {
    const { aggregateId, data, occurredOn, eventId } = params;
    return new CartItemAdded({
      aggregateId,
      item: data.item,
      eventId,
      occurredOn,
    });
  }
}
