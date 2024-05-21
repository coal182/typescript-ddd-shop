import {DomainEventClass} from '@shared/domain/domain-event';
import {DomainEventSubscriber} from '@shared/domain/domain-event-subscriber';
import {ProductId} from '@shared/product/domain/product-id';
import {ProductCreated} from '@shop-backend/product/domain/events/product-created';

import {ProductsCounterIncrementer} from './products-counter-incrementer';

export class IncrementProductsCounterOnProductCreated implements DomainEventSubscriber<ProductCreated> {
    constructor(private incrementer: ProductsCounterIncrementer) {}

    subscribedTo(): DomainEventClass[] {
        return [ProductCreated];
    }

    async on(domainEvent: ProductCreated): Promise<void> {
        await this.incrementer.run(new ProductId(domainEvent.aggregateId));
    }
}
