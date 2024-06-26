import {ProductsCounterNotExist} from '@shop-backend/products-counter/domain/products-counter-not-exist';
import {ProductsCounterRepository} from '@shop-backend/products-counter/domain/products-counter-repository';

export class ProductsCounterFinder {
    constructor(private repository: ProductsCounterRepository) {}

    async run(): Promise<number> {
        const counter = await this.repository.search();
        if (!counter) {
            throw new ProductsCounterNotExist();
        }

        return counter.total.value;
    }
}
