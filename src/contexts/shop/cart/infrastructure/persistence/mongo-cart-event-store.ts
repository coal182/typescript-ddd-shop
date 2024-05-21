import {MongoEventStore} from '@infrastructure/persistence/mongo/mongo-event-store';
import {DomainEvent, DomainEventClass} from '@shared/domain/domain-event';
import {Uuid} from '@shared/domain/value-objects/uuid';
import {CartEventStore} from '@shop-backend/cart/domain/cart-event-store';
import {CartCleared} from '@shop-backend/cart/domain/events/cart-cleared';
import {CartItemAdded} from '@shop-backend/cart/domain/events/cart-item-added';
import {CartItemRemoved} from '@shop-backend/cart/domain/events/cart-item-removed';
import {CartCreated} from 'src/contexts/shop/cart/domain/events/cart-created';

export class MongoCartEventStore extends MongoEventStore implements CartEventStore {
    public save(events: DomainEvent[]): Promise<void> {
        return this.persist(events);
    }
    public async findByAggregateId(aggregateId: Uuid): Promise<DomainEvent[]> {
        return super.findByAggregateId(aggregateId);
    }
    protected collectionName(): string {
        return 'cart_events';
    }

    protected eventsMap(): Map<string, DomainEventClass> {
        return new Map<string, DomainEventClass>([
            ['cart.created', CartCreated],
            ['cart.cleared', CartCleared],
            ['cart.item_added', CartItemAdded],
            ['cart.item_removed', CartItemRemoved],
        ]);
    }
}
