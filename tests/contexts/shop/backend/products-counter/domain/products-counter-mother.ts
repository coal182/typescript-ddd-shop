import {ProductId} from '@shared/product/domain/product-id';
import {ProductsCounter} from '@shop-backend/products-counter/domain/products-counter';
import {ProductsCounterId} from '@shop-backend/products-counter/domain/products-counter-id';
import {ProductsCounterTotal} from '@shop-backend/products-counter/domain/products-counter-total';
import {ProductIdMother} from 'tests/contexts/shared/product/domain/product-id-mother';
import {Repeater} from 'tests/contexts/shared/repeater';

import {ProductsCounterTotalMother} from './products-counter-total-mother';

export class ProductsCounterMother {
    static random(): ProductsCounter {
        const total = ProductsCounterTotalMother.random();
        return new ProductsCounter(ProductsCounterId.random(), total, Repeater.random(ProductIdMother.random.bind(ProductIdMother), total.value));
    }

    static withOne(productId: ProductId): ProductsCounter {
        return new ProductsCounter(ProductsCounterId.random(), new ProductsCounterTotal(1), [productId]);
    }
}
