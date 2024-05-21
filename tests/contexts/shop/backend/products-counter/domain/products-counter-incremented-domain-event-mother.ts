import {DomainEvent} from '@shared/domain/domain-event';
import {ProductsCounter} from '@shop-backend/products-counter/domain/products-counter';
import {ProductsCounterIncremented} from '@shop-backend/products-counter/domain/products-counter-incremented-domain-event';

import {ProductsCounterMother} from './products-counter-mother';

export class ProductsCounterIncrementedDomainEventMother {
    static create(): DomainEvent {
        return ProductsCounterIncrementedDomainEventMother.fromProductCounter(ProductsCounterMother.random());
    }

    static fromProductCounter(counter: ProductsCounter): ProductsCounterIncremented {
        return new ProductsCounterIncremented({
            aggregateId: counter.id.value,
            total: counter.total.value,
        });
    }
}
