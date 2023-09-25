import { Query } from '@shared/domain/query';
import { QueryHandler } from '@shared/domain/query-handler';

import { BackofficeProductResponse } from '../backoffice-products-response';

import { ProductFinder } from './product-finder';
import { SearchProductByIdQuery } from './search-product-by-id-query';

export class SearchProductByIdQueryHandler implements QueryHandler<SearchProductByIdQuery, BackofficeProductResponse> {
  constructor(private finder: ProductFinder) {}

  subscribedTo(): Query {
    return SearchProductByIdQuery;
  }

  async handle(query: SearchProductByIdQuery): Promise<BackofficeProductResponse> {
    const product = await this.finder.run(query.id);

    return new BackofficeProductResponse(product);
  }
}
