import { MongoEventStore } from '@infrastructure/persistence/mongo/mongo-event-store';
import { DomainEvent, DomainEventClass } from '@shared/domain/domain-event';
import { Uuid } from '@shared/domain/value-objects/uuid';
import { ProductCreated } from 'src/contexts/shop/product/domain/events/product-created';
import { ProductDescriptionChanged } from 'src/contexts/shop/product/domain/events/product-description-changed';
import { ProductImageChanged } from 'src/contexts/shop/product/domain/events/product-image-changed';
import { ProductEventStore } from 'src/contexts/shop/product/domain/product-event-store';

export class MongoProductEventStore extends MongoEventStore implements ProductEventStore {
  public save(events: DomainEvent[]): Promise<void> {
    return this.persist(events);
  }
  public async findByAggregateId(aggregateId: Uuid): Promise<DomainEvent[]> {
    return super.findByAggregateId(aggregateId);
  }
  protected collectionName(): string {
    return 'product_events';
  }

  protected eventsMap(): Map<string, DomainEventClass> {
    return new Map<string, DomainEventClass>([
      ['product.created', ProductCreated],
      ['product.description_changed', ProductDescriptionChanged],
      ['product.image_changed', ProductImageChanged],
    ]);
  }
}
