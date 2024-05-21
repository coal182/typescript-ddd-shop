import {Filters} from '@shared/domain/criteria/filters';
import {Order} from '@shared/domain/criteria/order';
import {Query} from '@shared/domain/query';
import {QueryHandler} from '@shared/domain/query-handler';

import {ProductsByCriteriaSearcher} from './products-by-criteria-searcher';
import {SearchProductsByCriteriaQuery} from './search-products-by-criteria-query';

import {ProductsResponse} from '../product-response';

// eslint-disable-next-line prettier/prettier
export class SearchProductsByCriteriaQueryHandler implements QueryHandler<SearchProductsByCriteriaQuery, ProductsResponse>
{
    constructor(private searcher: ProductsByCriteriaSearcher) {}

    subscribedTo(): Query {
        return SearchProductsByCriteriaQuery;
    }

    handle(query: SearchProductsByCriteriaQuery): Promise<ProductsResponse> {
        const filters = Filters.fromValues(query.filters);
        const order = Order.fromValues(query.orderBy, query.orderType);

        return this.searcher.run(filters, order, query.limit, query.offset);
    }
}
