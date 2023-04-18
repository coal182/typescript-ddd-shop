import { DomainEvent } from '@core/domain-event';

type CreateBookDomainEventAttributes = {
  readonly name: string;
  readonly description: string;
  readonly image: string;
  readonly author: string;
  readonly price: number;
};

export class BookCreated extends DomainEvent {
  static readonly EVENT_NAME = 'book.created';

  readonly name: string;
  readonly description: string;
  readonly image: string;
  readonly author: string;
  readonly price: number;

  constructor({
    aggregateId,
    name,
    description,
    image,
    author,
    price,
    eventId,
    occurredOn,
  }: {
    aggregateId: string;
    name: string;
    description: string;
    image: string;
    author: string;
    price: number;
    eventId?: string;
    occurredOn?: Date;
  }) {
    super({ eventName: BookCreated.EVENT_NAME, aggregateId, eventId, occurredOn });
    this.name = name;
    this.description = description;
    this.image = image;
    this.author = author;
    this.price = price;
  }

  toPrimitives(): CreateBookDomainEventAttributes {
    const { name, description, image, author, price } = this;
    return {
      name,
      description,
      image,
      author,
      price,
    };
  }

  static fromPrimitives(params: {
    aggregateId: string;
    attributes: CreateBookDomainEventAttributes;
    eventId: string;
    occurredOn: Date;
  }): DomainEvent {
    const { aggregateId, attributes, occurredOn, eventId } = params;
    return new BookCreated({
      aggregateId,
      name: attributes.name,
      description: attributes.description,
      image: attributes.image,
      author: attributes.author,
      price: attributes.price,
      eventId,
      occurredOn,
    });
  }
}
