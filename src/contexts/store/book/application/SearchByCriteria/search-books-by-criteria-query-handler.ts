import { Filters } from '@shared/domain/criteria/Filters';
import { Order } from '@shared/domain/criteria/Order';
import { Query } from '@shared/domain/Query';
import { QueryHandler } from '@shared/domain/QueryHandler';

import { BooksResponse } from '../books-response';

import { BooksByCriteriaSearcher } from './books-by-criteria-searcher';
import { SearchBooksByCriteriaQuery } from './search-books-by-criteria-query';

export class SearchBooksByCriteriaQueryHandler implements QueryHandler<SearchBooksByCriteriaQuery, BooksResponse> {
  constructor(private searcher: BooksByCriteriaSearcher) {}

  subscribedTo(): Query {
    return SearchBooksByCriteriaQuery;
  }

  handle(query: SearchBooksByCriteriaQuery): Promise<BooksResponse> {
    const filters = Filters.fromValues(query.filters);
    const order = Order.fromValues(query.orderBy, query.orderType);

    return this.searcher.run(filters, order, query.limit, query.offset);
  }
}
