import { DomainEventClass } from '@shared/domain/domain-event';
import { DomainEventSubscriber } from '@shared/domain/domain-event-subscriber';
import { ProductCreated } from '@shop-backend/product/domain/events/product-created';
import { ProductId } from '@shop-backend/product/domain/product-id';

import { ProductsCounterIncrementer } from './products-counter-incrementer';

export class IncrementProductsCounterOnProductCreated implements DomainEventSubscriber<ProductCreated> {
  constructor(private incrementer: ProductsCounterIncrementer) {}

  subscribedTo(): DomainEventClass[] {
    return [ProductCreated];
  }

  async on(domainEvent: ProductCreated) {
    await this.incrementer.run(new ProductId(domainEvent.aggregateId));
  }
}
