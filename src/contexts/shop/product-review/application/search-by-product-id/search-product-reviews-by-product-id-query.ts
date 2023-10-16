import { Query } from '@shared/domain/query';
import { ProductId } from '@shared/product/domain/product-id';

export class SearchProductReviewsByProductIdQuery implements Query {
  readonly productId: ProductId;

  constructor(productId: ProductId) {
    this.productId = productId;
  }
}
