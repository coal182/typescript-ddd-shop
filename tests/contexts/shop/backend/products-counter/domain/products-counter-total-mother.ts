import {ProductsCounterTotal} from '@shop-backend/products-counter/domain/products-counter-total';
import {IntegerMother} from 'tests/contexts/shared/integer-mother';

export class ProductsCounterTotalMother {
    static random(): ProductsCounterTotal {
        return new ProductsCounterTotal(IntegerMother.random());
    }
}
