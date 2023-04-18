import { DomainEvent } from '@core/domain-event';

type ChangeBookImageDomainEventAttributes = {
  readonly image: string;
};

export class BookImageChanged extends DomainEvent {
  static readonly EVENT_NAME = 'book.image_changed';

  readonly image: string;

  constructor({
    aggregateId,
    image,
    eventId,
    occurredOn,
  }: {
    aggregateId: string;
    image: string;
    eventId?: string;
    occurredOn?: Date;
  }) {
    super({ eventName: BookImageChanged.EVENT_NAME, aggregateId, eventId, occurredOn });
    this.image = image;
  }

  toPrimitives(): ChangeBookImageDomainEventAttributes {
    const { image } = this;
    return {
      image,
    };
  }

  static fromPrimitives(params: {
    aggregateId: string;
    attributes: ChangeBookImageDomainEventAttributes;
    eventId: string;
    occurredOn: Date;
  }): DomainEvent {
    const { aggregateId, attributes, occurredOn, eventId } = params;
    return new BookImageChanged({
      aggregateId,
      image: attributes.image,
      eventId,
      occurredOn,
    });
  }
}
