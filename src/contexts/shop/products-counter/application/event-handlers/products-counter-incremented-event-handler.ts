import {DomainEventClass} from '@shared/domain/domain-event';
import {DomainEventSubscriber} from '@shared/domain/domain-event-subscriber';
import {ProductsCounterIncremented} from '@shop-backend/products-counter/domain/products-counter-incremented-domain-event';

export class ProductsCounterIncrementedEventHandler implements DomainEventSubscriber<ProductsCounterIncremented> {
    public event: string = ProductsCounterIncremented.name;

    subscribedTo(): DomainEventClass[] {
        return [ProductsCounterIncremented];
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async on(_domainEvent: ProductsCounterIncremented): Promise<void> {
        // no-op: topic must exist in Kafka for publishing
    }
}
