import { DomainEventClass } from '@shared/domain/domain-event';
import { DomainEventSubscriber } from '@shared/domain/domain-event-subscriber';
import { NotFoundException } from '@shared/domain/errors/application-error';
import { ProductImageChanged } from 'src/contexts/shop/product/domain/events/product-image-changed';
import { Product } from 'src/contexts/shop/product/domain/product';
import { ProductEventStore } from 'src/contexts/shop/product/domain/product-event-store';
import { ProductId } from 'src/contexts/shop/product/domain/product-id';
import { ProductImage } from 'src/contexts/shop/product/domain/product-image';
import { ProductRepository } from 'src/contexts/shop/product/domain/product-repository';

export class ProductImageChangedEventHandler implements DomainEventSubscriber<ProductImageChanged> {
  public event = ProductImageChanged.name;

  constructor(private eventStore: ProductEventStore, private repository: ProductRepository) {}

  subscribedTo(): DomainEventClass[] {
    return [ProductImageChanged];
  }

  async on(domainEvent: ProductImageChanged): Promise<void> {
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
