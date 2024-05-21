import {MongoEventStore} from '@infrastructure/persistence/mongo/mongo-event-store';
import {DomainEvent, DomainEventClass} from '@shared/domain/domain-event';
import {Uuid} from '@shared/domain/value-objects/uuid';
import {ProductReviewUpdated} from '@shop-backend/product-review/domain/events/product-review-updated';
import {ProductReviewCreated} from 'src/contexts/shop/product-review/domain/events/product-review-created';
import {ProductReviewEventStore} from 'src/contexts/shop/product-review/domain/product-review-event-store';

export class MongoProductReviewEventStore extends MongoEventStore implements ProductReviewEventStore {
    public save(events: DomainEvent[]): Promise<void> {
        return this.persist(events);
    }
    public async findByAggregateId(aggregateId: Uuid): Promise<DomainEvent[]> {
        return super.findByAggregateId(aggregateId);
    }
    protected collectionName(): string {
        return 'product_review_events';
    }

    protected eventsMap(): Map<string, DomainEventClass> {
        return new Map<string, DomainEventClass>([
            ['product_review.created', ProductReviewCreated],
            ['product_review.updated', ProductReviewUpdated],
        ]);
    }
}
