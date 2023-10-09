import { DomainEvent } from '@shared/domain/domain-event';

type CreateProductDomainEventData = {
  readonly name: string;
  readonly description: string;
  readonly images: string[];
  readonly price: number;
  readonly brand: string;
  readonly category: string;
  readonly ean: string;
  readonly active: boolean;
  readonly createdAt: Date;
};

export class ProductCreated extends DomainEvent {
  static readonly EVENT_NAME = 'product.created';

  readonly name: string;
  readonly description: string;
  readonly images: string[];
  readonly price: number;
  readonly brand: string;
  readonly category: string;
  readonly ean: string;
  readonly active: boolean;
  readonly createdAt: Date;

  constructor({
    aggregateId,
    name,
    description,
    images,
    price,
    brand,
    category,
    ean,
    active,
    createdAt,
    eventId,
    occurredOn,
  }: {
    aggregateId: string;
    name: string;
    description: string;
    images: string[];
    price: number;
    brand: string;
    category: string;
    ean: string;
    active: boolean;
    createdAt: Date;
    eventId?: string;
    occurredOn?: Date;
  }) {
    super({ eventName: ProductCreated.EVENT_NAME, aggregateId, eventId, occurredOn });
    this.name = name;
    this.description = description;
    this.images = images;
    this.price = price;
    this.brand = brand;
    this.category = category;
    this.ean = ean;
    this.active = active;
    this.createdAt = createdAt;
  }

  toPrimitives(): CreateProductDomainEventData {
    const { name, description, images, price, brand, category, ean, active, createdAt } = this;
    return {
      name,
      description,
      images,
      price,
      brand,
      category,
      ean,
      active,
      createdAt,
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
      images: data.images,
      price: data.price,
      brand: data.brand,
      category: data.category,
      ean: data.ean,
      active: data.active,
      createdAt: data.createdAt,
      eventId,
      occurredOn,
    });
  }
}
