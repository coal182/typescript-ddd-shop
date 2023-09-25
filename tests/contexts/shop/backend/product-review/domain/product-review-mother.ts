import { ProductId } from '@shop-backend/product/domain/product-id';
import { CreateProductReviewCommand } from '@shop-backend/product-review/application/commands/create-product-review';
import { ProductReview } from '@shop-backend/product-review/domain/product-review';
import { ProductReviewComment } from '@shop-backend/product-review/domain/product-review-comment';
import { ProductReviewId } from '@shop-backend/product-review/domain/product-review-id';
import { ProductReviewRating } from '@shop-backend/product-review/domain/product-review-rating';
import { UserId } from 'src/contexts/shop/user/domain/user-id';

import { ProductIdMother } from '../../product/domain/product-id-mother';
import { UserIdMother } from '../../user/domain/user-id-mother';

import { ProductReviewCommentMother } from './product-review-comment-mother';
import { ProductReviewIdMother } from './product-review-id-mother';
import { ProductReviewRatingMother } from './product-review-rating-mother';

export class ProductReviewMother {
  static create(
    id: ProductReviewId,
    productId: ProductId,
    userId: UserId,
    rating: ProductReviewRating,
    comment: ProductReviewComment,
    createdAt: Date
  ): ProductReview {
    return new ProductReview(id, productId, userId, rating, comment, createdAt);
  }

  static from(command: CreateProductReviewCommand): ProductReview {
    return this.create(
      ProductReviewIdMother.create(command.id),
      ProductIdMother.create(command.productId),
      UserIdMother.create(command.userId),
      ProductReviewRatingMother.create(command.rating),
      ProductReviewCommentMother.create(command.comment),
      new Date()
    );
  }

  static random(): ProductReview {
    return this.create(
      ProductReviewIdMother.random(),
      ProductIdMother.random(),
      UserIdMother.random(),
      ProductReviewRatingMother.random(),
      ProductReviewCommentMother.random(),
      new Date()
    );
  }
}
