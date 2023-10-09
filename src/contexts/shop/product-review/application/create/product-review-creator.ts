import { EventBus } from '@shared/domain/event-bus';
import { ProductFinder } from '@shop-backend/product/application/search-by-id/product-finder';
import { ProductReview } from '@shop-backend/product-review/domain/product-review';
import { ProductReviewComment } from '@shop-backend/product-review/domain/product-review-comment';
import { ProductReviewEventStore } from '@shop-backend/product-review/domain/product-review-event-store';
import { ProductReviewId } from '@shop-backend/product-review/domain/product-review-id';
import { ProductReviewRating } from '@shop-backend/product-review/domain/product-review-rating';
import { UserId } from '@shop-backend/user/domain/user-id';
import { ProductId } from '@shared/product/domain/product-id';

export class ProductReviewCreator {
  constructor(
    private eventBus: EventBus,
    private eventStore: ProductReviewEventStore,
    private productFinder: ProductFinder
  ) {}

  async run(params: {
    id: ProductReviewId;
    productId: ProductId;
    userId: UserId;
    rating: ProductReviewRating;
    comment: ProductReviewComment;
  }): Promise<void> {
    const product = await this.productFinder.run(params.productId);

    const productReview = ProductReview.create(
      params.id,
      params.productId,
      params.userId,
      params.rating,
      params.comment
    );

    const newDomainEvents = productReview.pullDomainEvents();
    await this.eventStore.save(newDomainEvents);
    await this.eventBus.publish(newDomainEvents);
  }
}
