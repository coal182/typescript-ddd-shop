import {DomainEvent} from '@shared/domain/domain-event';

type OrderCancelledDomainEventData = object;

export class OrderCancelled extends DomainEvent {
    static readonly EVENT_NAME = 'order.cancelled';

    constructor({aggregateId, eventId, occurredOn}: {aggregateId: string; eventId?: string; occurredOn?: Date}) {
        super({eventName: OrderCancelled.EVENT_NAME, aggregateId, eventId, occurredOn});
    }

    toPrimitives(): OrderCancelledDomainEventData {
        return {};
    }

    static fromPrimitives(params: {aggregateId: string; data: OrderCancelledDomainEventData; eventId: string; occurredOn: Date}): DomainEvent {
        const {aggregateId, occurredOn, eventId} = params;
        return new OrderCancelled({
            aggregateId,
            eventId,
            occurredOn,
        });
    }
}
