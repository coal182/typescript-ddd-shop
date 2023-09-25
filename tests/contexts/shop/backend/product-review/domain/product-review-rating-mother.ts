import { ProductReviewRating } from '@shop-backend/product-review/domain/product-review-rating';
import { IntegerMother } from 'tests/contexts/shared/integer-mother';

export class ProductReviewRatingMother {
  static create(value: number): ProductReviewRating {
    return new ProductReviewRating(value);
  }

  static random(): ProductReviewRating {
    return this.create(IntegerMother.random(5));
  }

  static invalid(): number {
    return 6;
  }
}
