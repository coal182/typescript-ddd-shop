import { Filters } from '@shared/domain/criteria/filters';
import { Order } from '@shared/domain/criteria/order';
import { Query } from '@shared/domain/query';
import { QueryHandler } from '@shared/domain/query-handler';

import { BackofficeProductsResponse } from '../backoffice-products-response';

import { ProductsByCriteriaSearcher } from './products-by-criteria-searcher';
import { SearchProductsByCriteriaQuery } from './search-products-by-criteria-query';

// eslint-disable-next-line prettier/prettier
export class SearchProductsByCriteriaQueryHandler implements QueryHandler<SearchProductsByCriteriaQuery, BackofficeProductsResponse>
{
  constructor(private searcher: ProductsByCriteriaSearcher) {}

  subscribedTo(): Query {
    return SearchProductsByCriteriaQuery;
  }

  handle(query: SearchProductsByCriteriaQuery): Promise<BackofficeProductsResponse> {
    const filters = Filters.fromValues(query.filters);
    const order = Order.fromValues(query.orderBy, query.orderType);

    return this.searcher.run(filters, order, query.limit, query.offset);
  }
}
