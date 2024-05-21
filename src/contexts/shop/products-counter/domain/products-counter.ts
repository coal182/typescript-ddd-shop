import {AggregateRoot} from '@shared/domain/aggregate-root';
import {DomainEvent} from '@shared/domain/domain-event';
import {Uuid} from '@shared/domain/value-objects/uuid';
import {ProductId} from '@shared/product/domain/product-id';

import {ProductsCounterId} from './products-counter-id';
import {ProductsCounterIncremented} from './products-counter-incremented-domain-event';
import {ProductsCounterTotal} from './products-counter-total';

export class ProductsCounter extends AggregateRoot {
    readonly id: ProductsCounterId;
    private _total: ProductsCounterTotal;
    readonly existingProducts: Array<ProductId>;

    constructor(id: ProductsCounterId, total: ProductsCounterTotal, existingProducts?: Array<ProductId>) {
        super();
        this.id = id;
        this._total = total;
        this.existingProducts = existingProducts || [];
    }

    public get total(): ProductsCounterTotal {
        return this._total;
    }

    static initialize(id: Uuid): ProductsCounter {
        return new ProductsCounter(id, ProductsCounterTotal.initialize());
    }

    increment(productId: ProductId): void {
        this._total = this.total.increment();
        this.existingProducts.push(productId);
        this.record(new ProductsCounterIncremented({aggregateId: this.id.value, total: this.total.value}));
    }

    hasIncremented(productId: ProductId): boolean {
        const exists = this.existingProducts.find((entry) => entry.value === productId.value);
        return exists !== undefined;
    }

    toPrimitives(): {id: string; total: number; existingProducts: ReadonlyArray<string>} {
        return {
            id: this.id.value,
            total: this.total.value,
            existingProducts: this.existingProducts.map((productId) => productId.value),
        };
    }

    static fromPrimitives(data: {id: string; total: number; existingProducts: ReadonlyArray<string>}): ProductsCounter {
        return new ProductsCounter(
            new ProductsCounterId(data.id),
            new ProductsCounterTotal(data.total),
            data.existingProducts.map((entry) => new ProductId(entry)),
        );
    }

    applyEvent(event: DomainEvent): void {
        switch (event.eventName) {
            case 'products_counter.incremented':
                this.applyProductCreated(event as ProductsCounterIncremented);
                break;
            default:
                throw new Error(`Unsupported event: ${event.eventName}`);
        }
    }
}
