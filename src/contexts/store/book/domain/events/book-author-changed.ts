import { DomainEvent } from '@core/domain-event';

type ChangeBookAuthorDomainEventAttributes = {
  readonly author: string;
};

export class BookAuthorChanged extends DomainEvent {
  static readonly EVENT_NAME = 'book.author_changed';

  readonly author: string;

  constructor({
    aggregateId,
    author,
    eventId,
    occurredOn,
  }: {
    aggregateId: string;
    author: string;
    eventId?: string;
    occurredOn?: Date;
  }) {
    super({ eventName: BookAuthorChanged.EVENT_NAME, aggregateId, eventId, occurredOn });
    this.author = author;
  }

  toPrimitives(): ChangeBookAuthorDomainEventAttributes {
    const { author } = this;
    return {
      author,
    };
  }

  static fromPrimitives(params: {
    aggregateId: string;
    attributes: ChangeBookAuthorDomainEventAttributes;
    eventId: string;
    occurredOn: Date;
  }): DomainEvent {
    const { aggregateId, attributes, occurredOn, eventId } = params;
    return new BookAuthorChanged({
      aggregateId,
      author: attributes.author,
      eventId,
      occurredOn,
    });
  }
}
