import {DomainEvent} from '@shared/domain/domain-event';

import {CartItem} from '../cart-item';

type CartItemRemovedDomainEventData = {
    readonly item: CartItem;
};
export class CartItemRemoved extends DomainEvent {
    static readonly EVENT_NAME = 'cart.item_removed';

    readonly item: CartItem;

    constructor({aggregateId, item, eventId, occurredOn}: {aggregateId: string; item: CartItem; eventId?: string; occurredOn?: Date}) {
        super({eventName: CartItemRemoved.EVENT_NAME, aggregateId, eventId, occurredOn});
        this.item = item;
    }

    toPrimitives(): CartItemRemovedDomainEventData {
        const {item} = this;
        return {
            item,
        };
    }

    static fromPrimitives(params: {aggregateId: string; data: CartItemRemovedDomainEventData; eventId: string; occurredOn: Date}): DomainEvent {
        const {aggregateId, data, occurredOn, eventId} = params;
        return new CartItemRemoved({
            aggregateId,
            item: data.item,
            eventId,
            occurredOn,
        });
    }
}
