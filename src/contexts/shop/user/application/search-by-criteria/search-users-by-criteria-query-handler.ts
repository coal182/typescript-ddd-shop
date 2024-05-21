import {Filters} from '@shared/domain/criteria/filters';
import {Order} from '@shared/domain/criteria/order';
import {Query} from '@shared/domain/query';
import {QueryHandler} from '@shared/domain/query-handler';

import {SearchUsersByCriteriaQuery} from './search-users-by-criteria-query';
import {UsersByCriteriaSearcher} from './users-by-criteria-searcher';

import {UsersResponse} from '../user-response';

export class SearchUsersByCriteriaQueryHandler implements QueryHandler<SearchUsersByCriteriaQuery, UsersResponse> {
    constructor(private searcher: UsersByCriteriaSearcher) {}

    subscribedTo(): Query {
        return SearchUsersByCriteriaQuery;
    }

    handle(query: SearchUsersByCriteriaQuery): Promise<UsersResponse> {
        const filters = Filters.fromValues(query.filters);
        const order = Order.fromValues(query.orderBy, query.orderType);

        return this.searcher.run(filters, order, query.limit, query.offset);
    }
}
