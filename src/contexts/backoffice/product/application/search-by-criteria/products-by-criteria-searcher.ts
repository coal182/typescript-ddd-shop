import { Criteria } from '@shared/domain/criteria/criteria';
import { Filters } from '@shared/domain/criteria/filters';
import { Order } from '@shared/domain/criteria/order';

import { ProductRepository } from '../../domain/product-repository';
import { ProductsResponse } from '../products-response';

export class ProductsByCriteriaSearcher {
  constructor(private repository: ProductRepository) {}

  async run(filters: Filters, order: Order, limit?: number, offset?: number): Promise<ProductsResponse> {
    const criteria = new Criteria(filters, order, limit, offset);

    const products = await this.repository.matching(criteria);

    return new ProductsResponse(products);
  }
}
