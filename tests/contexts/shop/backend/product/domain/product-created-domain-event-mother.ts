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
      aggregateId: product.id.value,
      name: product.name.value,
      description: product.description.value,
      images: product.images.map((image) => image.value),
      price: product.price.value,
      brand: product.brand.value,
      category: product.category.value,
      ean: product.ean.value,
      active: product.active,
      createdAt: product.createdAt,
    });
  }
}
