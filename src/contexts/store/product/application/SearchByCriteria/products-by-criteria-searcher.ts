import { Criteria } from '@shared/domain/criteria/Criteria';
import { Filters } from '@shared/domain/criteria/Filters';
import { Order } from '@shared/domain/criteria/Order';

import { ProductRepository } from '../../domain/ProductRepository';
import { ProductsResponse } from '../product-response';

export class ProductsByCriteriaSearcher {
  constructor(private repository: ProductRepository) {}

  async run(filters: Filters, order: Order, limit?: number, offset?: number): Promise<ProductsResponse> {
    const criteria = new Criteria(filters, order, limit, offset);

    const products = await this.repository.matching(criteria);

    return new ProductsResponse(products);
  }
}
