import { ProductReviewComment } from '@shop-backend/product-review/domain/product-review-comment';
import { WordMother } from 'tests/contexts/shared/word-mother';

export class ProductReviewCommentMother {
  static create(value: string): ProductReviewComment {
    return new ProductReviewComment(value);
  }

  static random(): ProductReviewComment {
    return this.create(WordMother.random());
  }
}
