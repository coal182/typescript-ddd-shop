import { MongoEventStore } from '@infrastructure/persistence/mongo/mongo-event-store';
import { DomainEvent, DomainEventClass } from '@shared/domain/domain-event';
import { Uuid } from '@shared/domain/value-objects/uuid';
import { OrderCancelled } from '@shop-backend/order/domain/events/order-cancelled';
import { OrderInitiated } from '@shop-backend/order/domain/events/order-initiated';
import { OrderLineAdded } from '@shop-backend/order/domain/events/order-line-added';
import { OrderCreated } from 'src/contexts/shop/order/domain/events/order-created';
import { OrderEventStore } from 'src/contexts/shop/order/domain/order-event-store';

export class MongoOrderEventStore extends MongoEventStore implements OrderEventStore {
  public save(events: DomainEvent[]): Promise<void> {
    return this.persist(events);
  }
  public async findByAggregateId(aggregateId: Uuid): Promise<DomainEvent[]> {
    return super.findByAggregateId(aggregateId);
  }
  protected collectionName(): string {
    return 'order_events';
  }

  protected eventsMap(): Map<string, DomainEventClass> {
    return new Map<string, DomainEventClass>([
      ['order.initiated', OrderInitiated],
      ['order.line_added', OrderLineAdded],
      ['order.created', OrderCreated],
      ['order.cancelled', OrderCancelled],
    ]);
  }
}
