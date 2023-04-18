import { DomainEvent } from '@core/domain-event';

type ChangeBookDescriptionDomainEventAttributes = {
  readonly description: string;
};

export class BookDescriptionChanged extends DomainEvent {
  static readonly EVENT_NAME = 'book.description_changed';

  readonly description: string;

  constructor({
    aggregateId,
    description,
    eventId,
    occurredOn,
  }: {
    aggregateId: string;
    description: string;
    eventId?: string;
    occurredOn?: Date;
  }) {
    super({ eventName: BookDescriptionChanged.EVENT_NAME, aggregateId, eventId, occurredOn });
    this.description = description;
  }

  toPrimitives(): ChangeBookDescriptionDomainEventAttributes {
    const { description } = this;
    return {
      description,
    };
  }

  static fromPrimitives(params: {
    aggregateId: string;
    attributes: ChangeBookDescriptionDomainEventAttributes;
    eventId: string;
    occurredOn: Date;
  }): DomainEvent {
    const { aggregateId, attributes, occurredOn, eventId } = params;
    return new BookDescriptionChanged({
      aggregateId,
      description: attributes.description,
      eventId,
      occurredOn,
    });
  }
}
