import { DomainEventClass } from '@shared/domain/DomainEvent';
import { DomainEventSubscriber } from '@shared/domain/DomainEventSubscriber';
import { NotFoundException } from '@shared/domain/errors/application-error';
import { ProductDescriptionChanged } from 'src/contexts/shop/product/domain/events/product-description-changed';
import { Product } from 'src/contexts/shop/product/domain/product';
import { ProductDescription } from 'src/contexts/shop/product/domain/product-description';
import { ProductId } from 'src/contexts/shop/product/domain/product-id';
import { ProductEventStore } from 'src/contexts/shop/product/domain/ProductEventStore';
import { ProductRepository } from 'src/contexts/shop/product/domain/ProductRepository';

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
