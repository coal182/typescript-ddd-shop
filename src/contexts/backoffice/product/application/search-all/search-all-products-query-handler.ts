import {Query} from '@shared/domain/query';
import {QueryHandler} from '@shared/domain/query-handler';

import {ProductsFinder} from './products-finder';
import {SearchAllProductsQuery} from './search-all-products-query';

import {ProductsResponse} from '../products-response';

export class SearchAllProductsQueryHandler implements QueryHandler<SearchAllProductsQuery, ProductsResponse> {
    constructor(private readonly productsFinder: ProductsFinder) {}

    subscribedTo(): Query {
        return SearchAllProductsQuery;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(query: SearchAllProductsQuery): Promise<ProductsResponse> {
        return new ProductsResponse(await this.productsFinder.run());
    }
}
