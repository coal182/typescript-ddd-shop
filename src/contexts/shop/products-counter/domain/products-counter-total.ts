import {NumberValueObject} from '@shared/domain/value-objects/number-value-object';

export class ProductsCounterTotal extends NumberValueObject {
    increment(): ProductsCounterTotal {
        return new ProductsCounterTotal(this.value + 1);
    }

    static initialize(): ProductsCounterTotal {
        return new ProductsCounterTotal(0);
    }
}
