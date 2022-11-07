import { inject, injectable } from 'inversify';

import { TYPES } from '@constants/types';
import { IQueryHandler } from '@core/i-query-handler';
import { Query } from '@core/query';
import { Filters } from '@shared/criteria/Filters';
import { Order } from '@shared/criteria/Order';

import { BooksByCriteriaSearcher } from '../books-by-criteria-searcher';
import { BooksResponse } from '../books-response';
import { SearchBooksByCriteriaQuery } from '../queries/search-books-by-criteria-query';

@injectable()
export class SearchBooksByCriteriaQueryHandler implements IQueryHandler<SearchBooksByCriteriaQuery, BooksResponse> {
  constructor(@inject(TYPES.BooksByCriteriaSearcher) private searcher: BooksByCriteriaSearcher) {}

  subscribedTo(): Query {
    return SearchBooksByCriteriaQuery;
  }

  handle(query: SearchBooksByCriteriaQuery): Promise<BooksResponse> {
    const filters = Filters.fromValues(query.filters);
    const order = Order.fromValues(query.orderBy, query.orderType);

    return this.searcher.run(filters, order, query.limit, query.offset);
  }
}
