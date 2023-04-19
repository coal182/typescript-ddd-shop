import { DomainEventClass } from '@core/domain-event';
import { DomainEventSubscriber } from '@core/domain-event-subscriber';
import { NotFoundException } from '@shared/domain/errors/application-error';
import { ProductImageChanged } from '@storeback/product/domain/events/product-image-changed';
import { Product } from '@storeback/product/domain/product';
import { ProductId } from '@storeback/product/domain/product-id';
import { ProductImage } from '@storeback/product/domain/product-image';
import { ProductEventStore } from '@storeback/product/domain/ProductEventStore';
import { ProductRepository } from '@storeback/product/domain/ProductRepository';

export class ProductImageChangedEventHandler implements DomainEventSubscriber<ProductImageChanged> {
  public event = ProductImageChanged.name;

  constructor(private eventStore: ProductEventStore, private repository: ProductRepository) {}

  subscribedTo(): DomainEventClass[] {
    return [ProductImageChanged];
  }

  async on(domainEvent: ProductImageChanged): Promise<void> {
    console.log('📌 ~ ProductImageChangedEventHandler domainEvent:', domainEvent);
    const id = new ProductId(domainEvent.aggregateId);
    const image = new ProductImage(domainEvent.image);

    const events = await this.eventStore.findByAggregateId(id);
    if (!events) {
      throw new NotFoundException('Product not found by its id');
    }

    const product = Product.createEmptyProduct(id);
    product.loadFromHistory(events);
    product.changeImage(image);
    await this.repository.save(product);
  }
}
