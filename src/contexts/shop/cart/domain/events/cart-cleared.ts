import {DomainEvent} from '@shared/domain/domain-event';

type CartClearedDomainEventData = object;

export class CartCleared extends DomainEvent {
    static readonly EVENT_NAME = 'cart.cleared';

    constructor({aggregateId, eventId, occurredOn}: {aggregateId: string; eventId?: string; occurredOn?: Date}) {
        super({eventName: CartCleared.EVENT_NAME, aggregateId, eventId, occurredOn});
    }

    toPrimitives(): CartClearedDomainEventData {
        return {};
    }

    static fromPrimitives(params: {aggregateId: string; data: CartClearedDomainEventData; eventId: string; occurredOn: Date}): DomainEvent {
        const {aggregateId, occurredOn, eventId} = params;
        return new CartCleared({
            aggregateId,
            eventId,
            occurredOn,
        });
    }
}
