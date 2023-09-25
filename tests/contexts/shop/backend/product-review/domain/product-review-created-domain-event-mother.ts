import { ProductReviewCreated } from '@shop-backend/product-review/domain/events/product-review-created';
import { ProductReview } from '@shop-backend/product-review/domain/product-review';

export class ProductReviewCreatedDomainEventMother {
  static create({
    aggregateId,
    eventId,
    productId,
    userId,
    rating,
    comment,
    createdAt,
    occurredOn,
  }: {
    aggregateId: string;
    eventId?: string;
    productId: string;
    userId: string;
    rating: number;
    comment: string;
    createdAt: Date;
    occurredOn?: Date;
  }): ProductReviewCreatedDomainEventMother {
    return new ProductReviewCreated({
      aggregateId,
      eventId,
      productId,
      userId,
      rating,
      comment,
      createdAt,
      occurredOn,
    });
  }

  static fromProductReview(productReview: ProductReview): ProductReviewCreated {
    return new ProductReviewCreated({
      aggregateId: productReview.getId(),
      productId: productReview.toPrimitives().productId,
      userId: productReview.toPrimitives().userId,
      rating: productReview.toPrimitives().rating,
      comment: productReview.toPrimitives().comment,
      createdAt: productReview.toPrimitives().createdAt,
    });
  }
}
