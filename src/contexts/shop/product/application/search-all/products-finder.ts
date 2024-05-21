import {Product} from '@shop-backend/product/domain/product';

import {ProductRepository} from '../../domain/product-repository';

export class ProductsFinder {
    constructor(private productRepository: ProductRepository) {}

    async run(): Promise<ReadonlyArray<Product>> {
        const products = await this.productRepository.searchAll();

        return products;
    }
}
