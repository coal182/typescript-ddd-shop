import {Filters} from '@shared/domain/criteria/filters';
import {Order} from '@shared/domain/criteria/order';
import {Query} from '@shared/domain/query';
import {QueryHandler} from '@shared/domain/query-handler';

import {CartsByCriteriaSearcher} from './carts-by-criteria-searcher';
import {SearchCartsByCriteriaQuery} from './search-carts-by-criteria-query';

import {CartsResponse} from '../cart-response';

export class SearchCartsByCriteriaQueryHandler implements QueryHandler<SearchCartsByCriteriaQuery, CartsResponse> {
    constructor(private searcher: CartsByCriteriaSearcher) {}

    subscribedTo(): Query {
        return SearchCartsByCriteriaQuery;
    }

    handle(query: SearchCartsByCriteriaQuery): Promise<CartsResponse> {
        const filters = Filters.fromValues(query.filters);
        const order = Order.fromValues(query.orderBy, query.orderType);

        return this.searcher.run(filters, order, query.limit, query.offset);
    }
}
