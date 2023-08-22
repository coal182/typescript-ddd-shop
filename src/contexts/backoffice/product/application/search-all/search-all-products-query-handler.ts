import { Query } from '@shared/domain/query';
import { QueryHandler } from '@shared/domain/query-handler';

import { BackofficeProductsResponse } from '../backoffice-products-response';

import { ProductsFinder } from './products-finder';
import { SearchAllProductsQuery } from './search-all-products-query';

export class SearchAllProductsQueryHandler implements QueryHandler<SearchAllProductsQuery, BackofficeProductsResponse> {
  constructor(private readonly productsFinder: ProductsFinder) {}

  subscribedTo(): Query {
    return SearchAllProductsQuery;
  }

  async handle(): Promise<BackofficeProductsResponse> {
    return new BackofficeProductsResponse(await this.productsFinder.run());
  }
}
