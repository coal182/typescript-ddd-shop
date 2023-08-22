import { Criteria } from '@shared/domain/criteria/criteria';
import { Filters } from '@shared/domain/criteria/filters';
import { Order } from '@shared/domain/criteria/order';

import { BackofficeProductRepository } from '../../domain/backoffice-product-repository';
import { BackofficeProductsResponse } from '../backoffice-products-response';

export class ProductsByCriteriaSearcher {
  constructor(private repository: BackofficeProductRepository) {}

  async run(filters: Filters, order: Order, limit?: number, offset?: number): Promise<BackofficeProductsResponse> {
    const criteria = new Criteria(filters, order, limit, offset);

    const products = await this.repository.matching(criteria);

    return new BackofficeProductsResponse(products);
  }
}
