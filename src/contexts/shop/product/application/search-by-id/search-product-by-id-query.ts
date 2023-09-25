import { Query } from '@shared/domain/query';
import { ProductId } from '@shop-backend/product/domain/product-id';

export class SearchProductByIdQuery implements Query {
  readonly id: ProductId;

  constructor(id: ProductId) {
    this.id = id;
  }
}
