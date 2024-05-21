import {Filters} from '@shared/domain/criteria/filters';
import {Order} from '@shared/domain/criteria/order';
import {Query} from '@shared/domain/query';
import {QueryHandler} from '@shared/domain/query-handler';

import {OrdersByCriteriaSearcher} from './orders-by-criteria-searcher';
import {SearchOrdersByCriteriaQuery} from './search-orders-by-criteria-query';

import {OrdersResponse} from '../order-response';

export class SearchOrdersByCriteriaQueryHandler implements QueryHandler<SearchOrdersByCriteriaQuery, OrdersResponse> {
    constructor(private searcher: OrdersByCriteriaSearcher) {}

    subscribedTo(): Query {
        return SearchOrdersByCriteriaQuery;
    }

    handle(query: SearchOrdersByCriteriaQuery): Promise<OrdersResponse> {
        const filters = Filters.fromValues(query.filters);
        const order = Order.fromValues(query.orderBy, query.orderType);

        return this.searcher.run(filters, order, query.limit, query.offset);
    }
}
