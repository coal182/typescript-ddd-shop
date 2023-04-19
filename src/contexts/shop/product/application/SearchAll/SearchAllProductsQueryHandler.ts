import { Query } from '@shared/domain/Query';
import { QueryHandler } from '@shared/domain/QueryHandler';

import { ProductsResponse } from '../product-response';

import { ProductsFinder } from './ProductsFinder';
import { SearchAllProductsQuery } from './SearchAllProductsQuery';

export class SearchAllProductsQueryHandler implements QueryHandler<SearchAllProductsQuery, ProductsResponse> {
  constructor(private readonly productsFinder: ProductsFinder) {}

  subscribedTo(): Query {
    return SearchAllProductsQuery;
  }

  async handle(): Promise<ProductsResponse> {
    return new ProductsResponse(await this.productsFinder.run());
  }
}
