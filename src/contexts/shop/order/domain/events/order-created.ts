import {DomainEvent} from '@shared/domain/domain-event';

type OrderCreatedDomainEventData = object;

export class OrderCreated extends DomainEvent {
    static readonly EVENT_NAME = 'order.created';

    constructor({aggregateId, eventId, occurredOn}: {aggregateId: string; eventId?: string; occurredOn?: Date}) {
        super({eventName: OrderCreated.EVENT_NAME, aggregateId, eventId, occurredOn});
    }

    toPrimitives(): OrderCreatedDomainEventData {
        return {};
    }

    static fromPrimitives(params: {aggregateId: string; data: OrderCreatedDomainEventData; eventId: string; occurredOn: Date}): DomainEvent {
        const {aggregateId, occurredOn, eventId} = params;
        return new OrderCreated({
            aggregateId,
            eventId,
            occurredOn,
        });
    }
}
