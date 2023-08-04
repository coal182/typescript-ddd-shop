import { ProductCreated } from '@storeback/product/domain/events/product-created';
import { Product } from '@storeback/product/domain/product';

export class ProductCreatedDomainEventMother {
  static create({
    aggregateId,
    eventId,
    name,
    description,
    image,
    price,
    brand,
    category,
    ean,
    occurredOn,
  }: {
    aggregateId: string;
    eventId?: string;
    name: string;
    description: string;
    image: string;
    price: number;
    brand: string;
    category: string;
    ean: string;
    occurredOn?: Date;
  }): ProductCreatedDomainEventMother {
    return new ProductCreated({
      aggregateId,
      eventId,
      name,
      description,
      image,
      price,
      brand,
      category,
      ean,
      occurredOn,
    });
  }

  static fromProduct(product: Product): ProductCreated {
    return new ProductCreated({
      aggregateId: product.id.value,
      name: product.name.value,
      description: product.description.value,
      image: product.image.value,
      price: product.price.value,
      brand: product.brand.value,
      category: product.category.value,
      ean: product.ean.value,
    });
  }
}
