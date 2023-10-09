import { DomainEventClass } from '@shared/domain/domain-event';
import { DomainEventSubscriber } from '@shared/domain/domain-event-subscriber';
import { NotFoundException } from '@shared/domain/errors/application-error';
import { ProductDescription } from '@shared/product/domain/product-description';
import { ProductId } from '@shared/product/domain/product-id';
import { ProductDescriptionChanged } from 'src/contexts/shop/product/domain/events/product-description-changed';
import { Product } from 'src/contexts/shop/product/domain/product';
import { ProductEventStore } from 'src/contexts/shop/product/domain/product-event-store';
import { ProductRepository } from 'src/contexts/shop/product/domain/product-repository';

export class ProductDescriptionChangedEventHandler implements DomainEventSubscriber<ProductDescriptionChanged> {
  public event = ProductDescriptionChanged.name;

  constructor(private eventStore: ProductEventStore, private repository: ProductRepository) {}

  subscribedTo(): DomainEventClass[] {
    return [ProductDescriptionChanged];
  }

  async on(domainEvent: ProductDescriptionChanged): Promise<void> {
    const id = new ProductId(domainEvent.aggregateId);
    const description = new ProductDescription(domainEvent.description);

    const events = await this.eventStore.findByAggregateId(id);
    if (!events) {
      throw new NotFoundException('Product not found by its id');
    }

    const product = Product.createEmptyProduct(id);
    product.loadFromHistory(events);
    product.changeDescription(description);
    await this.repository.save(product);
  }
}
