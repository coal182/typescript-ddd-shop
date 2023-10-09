import { Query } from '@shared/domain/query';
import { QueryHandler } from '@shared/domain/query-handler';

import { ProductsResponse } from '../products-response';

import { ProductsFinder } from './products-finder';
import { SearchAllProductsQuery } from './search-all-products-query';

export class SearchAllProductsQueryHandler implements QueryHandler<SearchAllProductsQuery, ProductsResponse> {
  constructor(private readonly productsFinder: ProductsFinder) {}

  subscribedTo(): Query {
    return SearchAllProductsQuery;
  }

  async handle(query: SearchAllProductsQuery): Promise<ProductsResponse> {
    return new ProductsResponse(await this.productsFinder.run());
  }
}
