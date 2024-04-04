import { AggregateRoot } from '@domain/aggregate-root';
import { DomainEvent } from '@domain/domain-event';
import { ProductId } from '@shared/product/domain/product-id';
import { UserId } from '@shop-backend/user/domain/user-id';

import { ProductReviewCreated } from './events/product-review-created';
import { ProductReviewUpdated } from './events/product-review-updated';
import { ProductReviewComment } from './product-review-comment';
import { ProductReviewId } from './product-review-id';
import { ProductReviewRating } from './product-review-rating';

export interface ProductReviewPrimitives {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface ProductReviewModel {
  id: ProductReviewId;
  productId: ProductId;
  userId: UserId;
  rating: ProductReviewRating;
  comment: ProductReviewComment;
  createdAt: Date;
}

export class ProductReview extends AggregateRoot {
  constructor(
    public id: ProductReviewId,
    private productId: ProductId,
    private userId: UserId,
    private rating: ProductReviewRating,
    private comment: ProductReviewComment,
    private createdAt: Date
  ) {
    super();
  }

  static create(
    id: ProductReviewId,
    productId: ProductId,
    userId: UserId,
    rating: ProductReviewRating,
    comment: ProductReviewComment
  ): ProductReview {
    const productReview = new ProductReview(id, productId, userId, rating, comment, new Date());

    productReview.record(
      new ProductReviewCreated({
        aggregateId: productReview.id.value,
        productId: productReview.productId.value,
        userId: productReview.userId.value,
        rating: productReview.rating.value,
        comment: productReview.comment.value,
        createdAt: productReview.createdAt,
      })
    );

    return productReview;
  }

  static initialize(id: ProductReviewId): ProductReview {
    return new ProductReview(
      id,
      ProductId.initialize(),
      UserId.initialize(),
      new ProductReviewRating(0),
      new ProductReviewComment(''),
      new Date()
    );
  }

  public applyProductReviewCreated(event: ProductReviewCreated): void {
    this.id = new ProductReviewId(event.aggregateId);
    this.productId = new ProductId(event.productId);
    this.userId = new UserId(event.userId);
    this.rating = new ProductReviewRating(event.rating);
    this.comment = new ProductReviewComment(event.comment);
    this.createdAt = event.createdAt;
  }

  public updateProductReview(
    productId: ProductId,
    userId: UserId,
    rating: ProductReviewRating,
    comment: ProductReviewComment
  ) {
    this.productId = productId;
    this.userId = userId;
    this.rating = rating;
    this.comment = comment;
    this.record(
      new ProductReviewUpdated({
        aggregateId: this.id.value,
        productId: productId.value,
        userId: userId.value,
        rating: rating.value,
        comment: comment.toString(),
      })
    );
  }

  public applyProductReviewUpdated(event: ProductReviewUpdated): void {
    this.productId = new ProductId(event.productId);
    this.userId = new UserId(event.userId);
    this.rating = new ProductReviewRating(event.rating);
    this.comment = new ProductReviewComment(event.comment);
  }

  applyEvent(event: DomainEvent): void {
    /*eslint indent: ["error", 2, {"SwitchCase": 1}]*/
    switch (event.eventName) {
      case 'product_review.created':
        this.applyProductReviewCreated(event as ProductReviewCreated);
        break;
      case 'product_review.updated':
        this.applyProductReviewUpdated(event as ProductReviewUpdated);
        break;
      default:
        throw new Error(`Unsupported event: ${event.eventName}`);
    }
  }

  static fromPrimitives(plainData: ProductReviewPrimitives): ProductReview {
    return new ProductReview(
      new ProductReviewId(plainData.id),
      new ProductId(plainData.productId),
      new UserId(plainData.userId),
      new ProductReviewRating(plainData.rating),
      new ProductReviewComment(plainData.comment),
      plainData.createdAt
    );
  }

  toPrimitives(): ProductReviewPrimitives {
    return {
      id: this.id.value,
      productId: this.productId.value,
      userId: this.userId.value,
      rating: this.rating.value,
      comment: this.comment.value,
      createdAt: this.createdAt,
    };
  }
}
