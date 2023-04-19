import { MongoEventStore } from '@infrastructure/persistence/mongo/MongoEventStore';
import { DomainEvent, DomainEventClass } from '@shared/domain/DomainEvent';
import { ProductCreated } from '@storeback/product/domain/events/product-created';
import { ProductDescriptionChanged } from '@storeback/product/domain/events/product-description-changed';
import { ProductImageChanged } from '@storeback/product/domain/events/product-image-changed';
import { ProductEventStore } from '@storeback/product/domain/ProductEventStore';

export class MongoProductEventStore extends MongoEventStore implements ProductEventStore {
  public save(events: DomainEvent[]): Promise<void> {
    return this.persist(events);
  }
  protected collectionName(): string {
    return 'product_events';
  }

  protected eventsMap(): Map<string, DomainEventClass> {
    const map = new Map();
    map.set('product.created', ProductCreated);
    map.set('product.description_changed', ProductDescriptionChanged);
    map.set('product.image_changed', ProductImageChanged);
    return map;
  }
}
