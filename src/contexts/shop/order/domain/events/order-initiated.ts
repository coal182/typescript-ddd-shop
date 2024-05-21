import {Primitives} from '@domain/value-objects/primitives-type';
import {DomainEvent} from '@shared/domain/domain-event';

import {OrderAddress} from '../order-address';

type InitiateOrderDomainEventData = {
    readonly userId: string;
    readonly status: string;
    readonly name: string;
    readonly address: Primitives<OrderAddress>;
    readonly total: number;
};

export class OrderInitiated extends DomainEvent {
    static readonly EVENT_NAME = 'order.initiated';

    readonly userId: string;
    readonly status: string;
    readonly name: string;
    readonly address: Primitives<OrderAddress>;
    readonly total: number;

    constructor({
        aggregateId,
        userId,
        status,
        name,
        address,
        total,
        eventId,
        occurredOn,
    }: {
        aggregateId: string;
        userId: string;
        status: string;
        name: string;
        address: Primitives<OrderAddress>;
        total: number;
        eventId?: string;
        occurredOn?: Date;
    }) {
        super({eventName: OrderInitiated.EVENT_NAME, aggregateId, eventId, occurredOn});
        this.userId = userId;
        this.status = status;
        this.name = name;
        this.address = address;
        this.total = total;
    }

    toPrimitives(): InitiateOrderDomainEventData {
        const {userId, status, name, address, total} = this;
        return {
            userId,
            status,
            name,
            address,
            total,
        };
    }

    static fromPrimitives(params: {aggregateId: string; data: InitiateOrderDomainEventData; eventId: string; occurredOn: Date}): DomainEvent {
        const {aggregateId, data, occurredOn, eventId} = params;
        return new OrderInitiated({
            aggregateId,
            userId: data.userId,
            status: data.status,
            name: data.name,
            address: data.address,
            total: data.total,
            eventId,
            occurredOn,
        });
    }
}
