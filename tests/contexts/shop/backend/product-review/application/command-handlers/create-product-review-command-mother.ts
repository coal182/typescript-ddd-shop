import { ProductId } from '@shared/product/domain/product-id';
import { CreateProductReviewCommand } from '@shop-backend/product-review/application/commands/create-product-review';
import { ProductReviewComment } from '@shop-backend/product-review/domain/product-review-comment';
import { ProductReviewId } from '@shop-backend/product-review/domain/product-review-id';
import { ProductReviewRating } from '@shop-backend/product-review/domain/product-review-rating';
import { UserId } from '@shop-backend/user/domain/user-id';
import { ProductIdMother } from 'tests/contexts/shared/product/domain/product-id-mother';

import { UserIdMother } from '../../../user/domain/user-id-mother';
import { ProductReviewCommentMother } from '../../domain/product-review-comment-mother';
import { ProductReviewIdMother } from '../../domain/product-review-id-mother';
import { ProductReviewRatingMother } from '../../domain/product-review-rating-mother';

export class CreateProductReviewCommandMother {
  static create(
    id: ProductReviewId,
    productId: ProductId,
    userId: UserId,
    rating: ProductReviewRating,
    comment: ProductReviewComment
  ): CreateProductReviewCommand {
    return {
      id: id.value,
      productId: productId.value,
      userId: userId.value,
      rating: rating.value,
      comment: comment.value,
    };
  }

  static random(): CreateProductReviewCommand {
    return this.create(
      ProductReviewIdMother.random(),
      ProductIdMother.random(),
      UserIdMother.random(),
      ProductReviewRatingMother.random(),
      ProductReviewCommentMother.random()
    );
  }

  static randomWithId(id: string): CreateProductReviewCommand {
    return this.create(
      ProductReviewIdMother.create(id),
      ProductIdMother.random(),
      UserIdMother.random(),
      ProductReviewRatingMother.random(),
      ProductReviewCommentMother.random()
    );
  }

  static invalidRating(): CreateProductReviewCommand {
    return {
      id: ProductReviewIdMother.random().value,
      productId: ProductIdMother.random().value,
      userId: UserIdMother.random().value,
      rating: ProductReviewRatingMother.invalid(),
      comment: ProductReviewCommentMother.random().value,
    };
  }
}
