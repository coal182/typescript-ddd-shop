import { DomainEventClass } from '@shared/domain/DomainEvent';
import { DomainEventSubscriber } from '@shared/domain/DomainEventSubscriber';
import { ProductCreated } from '@storeback/product/domain/events/product-created';
import { Product } from '@storeback/product/domain/product';
import { ProductDescription } from '@storeback/product/domain/product-description';
import { ProductId } from '@storeback/product/domain/product-id';
import { ProductImage } from '@storeback/product/domain/product-image';
import { ProductName } from '@storeback/product/domain/product-name';
import { ProductPrice } from '@storeback/product/domain/product-price';
import { ProductRepository } from '@storeback/product/domain/ProductRepository';

export class ProductCreatedEventHandler implements DomainEventSubscriber<ProductCreated> {
  public event = ProductCreated.name;

  constructor(private repository: ProductRepository) {}

  subscribedTo(): DomainEventClass[] {
    return [ProductCreated];
  }

  async on(domainEvent: ProductCreated): Promise<void> {
    const id = new ProductId(domainEvent.aggregateId);
    const name = new ProductName(domainEvent.name);
    const description = new ProductDescription(domainEvent.description);
    const image = new ProductImage(domainEvent.image);
    const price = new ProductPrice(domainEvent.price);

    const product = new Product(id, name, description, image, price);
    await this.repository.save(product);
  }
}
