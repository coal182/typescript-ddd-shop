import { ProductCreated } from '@shop-backend/product/domain/events/product-created';
import { Product } from '@shop-backend/product/domain/product';

export class ProductCreatedDomainEventMother {
  static create({
    aggregateId,
    eventId,
    name,
    description,
    images,
    price,
    brand,
    category,
    ean,
    active,
    createdAt,
    occurredOn,
  }: {
    aggregateId: string;
    eventId?: string;
    name: string;
    description: string;
    images: string[];
    price: number;
    brand: string;
    category: string;
    ean: string;
    active: boolean;
    createdAt: Date;
    occurredOn?: Date;
  }): ProductCreatedDomainEventMother {
    return new ProductCreated({
      aggregateId,
      eventId,
      name,
      description,
      images,
      price,
      brand,
      category,
      ean,
      active,
      createdAt,
      occurredOn,
    });
  }

  static fromProduct(product: Product): ProductCreated {
    return new ProductCreated({
      aggregateId: product.getId(),
      name: product.toPrimitives().name,
      description: product.toPrimitives().description,
      images: product.toPrimitives().images.map((image) => image),
      price: product.toPrimitives().price,
      brand: product.toPrimitives().brand,
      category: product.toPrimitives().category,
      ean: product.toPrimitives().ean,
      active: product.toPrimitives().active,
      createdAt: product.toPrimitives().createdAt,
    });
  }
}
