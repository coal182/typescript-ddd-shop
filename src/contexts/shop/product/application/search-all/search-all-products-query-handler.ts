import {Query} from '@shared/domain/query';
import {QueryHandler} from '@shared/domain/query-handler';

import {ProductsFinder} from './products-finder';
import {SearchAllProductsQuery} from './search-all-products-query';

import {ProductsResponse} from '../product-response';

export class SearchAllProductsQueryHandler implements QueryHandler<SearchAllProductsQuery, ProductsResponse> {
    constructor(private readonly productsFinder: ProductsFinder) {}

    subscribedTo(): Query {
        return SearchAllProductsQuery;
    }

    async handle(): Promise<ProductsResponse> {
        return new ProductsResponse(await this.productsFinder.run());
    }
}
