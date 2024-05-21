import {Query} from '@shared/domain/query';
import {QueryHandler} from '@shared/domain/query-handler';

import {ProductFinder} from './product-finder';
import {SearchProductByIdQuery} from './search-product-by-id-query';

import {ProductResponse} from '../product-response';

export class SearchProductByIdQueryHandler implements QueryHandler<SearchProductByIdQuery, ProductResponse> {
    constructor(private finder: ProductFinder) {}

    subscribedTo(): Query {
        return SearchProductByIdQuery;
    }

    async handle(query: SearchProductByIdQuery): Promise<ProductResponse> {
        const product = await this.finder.run(query.id);

        return new ProductResponse(product);
    }
}
