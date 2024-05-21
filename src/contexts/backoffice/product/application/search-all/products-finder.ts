import {Product} from '@backoffice-backend/product/domain/product';

import {ProductRepository} from '../../domain/product-repository';

export class ProductsFinder {
    constructor(private productsRepository: ProductRepository) {}

    async run(): Promise<ReadonlyArray<Product>> {
        const products = await this.productsRepository.searchAll();

        return products;
    }
}
