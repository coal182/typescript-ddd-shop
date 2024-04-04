import { DomainEventClass } from '@shared/domain/domain-event';
import { DomainEventSubscriber } from '@shared/domain/domain-event-subscriber';
import { NotFoundException } from '@shared/domain/errors/application-error';
import { ProductId } from '@shared/product/domain/product-id';
import { ProductImage } from '@shared/product/domain/product-image';
import { ProductImageChanged } from 'src/contexts/backoffice/product/domain/events/product-image-changed';
import { Product } from 'src/contexts/backoffice/product/domain/product';
import { ProductEventStore } from 'src/contexts/backoffice/product/domain/product-event-store';
import { ProductRepository } from 'src/contexts/backoffice/product/domain/product-repository';

export class ProductImageChangedEventHandler implements DomainEventSubscriber<ProductImageChanged> {
  public event = ProductImageChanged.name;

  constructor(private eventStore: ProductEventStore, private repository: ProductRepository) {}

  subscribedTo(): DomainEventClass[] {
    return [ProductImageChanged];
  }

  async on(domainEvent: ProductImageChanged): Promise<void> {
    const id = new ProductId(domainEvent.aggregateId);
    const images = domainEvent.images.map((image) => new ProductImage(image));

    const events = await this.eventStore.findByAggregateId(id);
    if (!events) {
      throw new NotFoundException('Product not found by its id');
    }

    const product = Product.initialize(id);
    product.loadFromHistory(events);
    product.changeImages(images);
    await this.repository.save(product);
  }
}
