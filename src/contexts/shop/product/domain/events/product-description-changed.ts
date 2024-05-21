import {DomainEvent} from '@shared/domain/domain-event';

type ChangeProductDescriptionDomainEventData = {
    readonly description: string;
};

export class ProductDescriptionChanged extends DomainEvent {
    static readonly EVENT_NAME = 'product.description_changed';

    readonly description: string;

    constructor({aggregateId, description, eventId, occurredOn}: {aggregateId: string; description: string; eventId?: string; occurredOn?: Date}) {
        super({eventName: ProductDescriptionChanged.EVENT_NAME, aggregateId, eventId, occurredOn});
        this.description = description;
    }

    toPrimitives(): ChangeProductDescriptionDomainEventData {
        const {description} = this;
        return {
            description,
        };
    }

    static fromPrimitives(params: {aggregateId: string; data: ChangeProductDescriptionDomainEventData; eventId: string; occurredOn: Date}): DomainEvent {
        const {aggregateId, data, occurredOn, eventId} = params;
        return new ProductDescriptionChanged({
            aggregateId,
            description: data.description,
            eventId,
            occurredOn,
        });
    }
}
