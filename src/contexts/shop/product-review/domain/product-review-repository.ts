import { Criteria } from '@shared/domain/criteria/criteria';
import { Nullable } from '@shared/domain/nullable';

import { ProductReview } from './product-review';
import { ProductReviewId } from './product-review-id';

export interface ProductReviewRepository {
  save(product: ProductReview): Promise<void>;
  search(id: ProductReviewId): Promise<Nullable<ProductReview>>;
  searchAll(): Promise<Array<ProductReview>>;
  matching(criteria: Criteria): Promise<Array<ProductReview>>;
}
