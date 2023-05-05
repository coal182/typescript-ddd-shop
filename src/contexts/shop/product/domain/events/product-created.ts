import { DomainEvent } from '@shared/domain/domain-event';

type CreateProductDomainEventData = {
  readonly name: string;
  readonly description: string;
  readonly image: string;
  readonly price: number;
  readonly brand: string;
  readonly category: string;
  readonly ean: string;
};

export class ProductCreated extends DomainEvent {
  static readonly EVENT_NAME = 'product.created';

  readonly name: string;
  readonly description: string;
  readonly image: string;
  readonly price: number;
  readonly brand: string;
  readonly category: string;
  readonly ean: string;

  constructor({
    aggregateId,
    name,
    description,
    image,
    price,
    brand,
    category,
    ean,
    eventId,
    occurredOn,
  }: {
    aggregateId: string;
    name: string;
    description: string;
    image: string;
    price: number;
    brand: string;
    category: string;
    ean: string;
    eventId?: string;
    occurredOn?: Date;
  }) {
    super({ eventName: ProductCreated.EVENT_NAME, aggregateId, eventId, occurredOn });
    this.name = name;
    this.description = description;
    this.image = image;
    this.price = price;
    this.brand = brand;
    this.category = category;
    this.ean = ean;
  }

  toPrimitives(): CreateProductDomainEventData {
    const { name, description, image, price, brand, category, ean } = this;
    return {
      name,
      description,
      image,
      price,
      brand,
      category,
      ean,
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
      brand: data.brand,
      category: data.category,
      ean: data.ean,
      eventId,
      occurredOn,
    });
  }
}
