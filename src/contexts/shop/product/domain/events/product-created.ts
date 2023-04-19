import { DomainEvent } from '@shared/domain/domain-event';

type CreateProductDomainEventData = {
  readonly name: string;
  readonly description: string;
  readonly image: string;
  readonly price: number;
};

export class ProductCreated extends DomainEvent {
  static readonly EVENT_NAME = 'product.created';

  readonly name: string;
  readonly description: string;
  readonly image: string;
  readonly price: number;

  constructor({
    aggregateId,
    name,
    description,
    image,
    price,
    eventId,
    occurredOn,
  }: {
    aggregateId: string;
    name: string;
    description: string;
    image: string;
    price: number;
    eventId?: string;
    occurredOn?: Date;
  }) {
    super({ eventName: ProductCreated.EVENT_NAME, aggregateId, eventId, occurredOn });
    this.name = name;
    this.description = description;
    this.image = image;
    this.price = price;
  }

  toPrimitives(): CreateProductDomainEventData {
    const { name, description, image, price } = this;
    return {
      name,
      description,
      image,
      price,
    };
  }

  static fromPrimitives(params: {
    aggregateId: string;
    data: CreateProductDomainEventData;
    eventId: string;
    occurredOn: Date;
  }): DomainEvent {
    const { aggregateId, data, occurredOn, eventId } = params;
    return new ProductCreated({
      aggregateId,
      name: data.name,
      description: data.description,
      image: data.image,
      price: data.price,
      eventId,
      occurredOn,
    });
  }
}
