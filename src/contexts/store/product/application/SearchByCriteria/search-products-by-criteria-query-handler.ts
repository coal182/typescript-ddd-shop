import { Filters } from '@shared/domain/criteria/Filters';
import { Order } from '@shared/domain/criteria/Order';
import { Query } from '@shared/domain/Query';
import { QueryHandler } from '@shared/domain/QueryHandler';

import { ProductsResponse } from '../product-response';

import { ProductsByCriteriaSearcher } from './products-by-criteria-searcher';
import { SearchProductsByCriteriaQuery } from './search-products-by-criteria-query';

export class SearchProductsByCriteriaQueryHandler
  implements QueryHandler<SearchProductsByCriteriaQuery, ProductsResponse>
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
