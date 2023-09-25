import { DomainEventClass } from '@shared/domain/domain-event';
import { DomainEventSubscriber } from '@shared/domain/domain-event-subscriber';
import { ProductId } from '@shop-backend/product/domain/product-id';
import { ProductReviewComment } from '@shop-backend/product-review/domain/product-review-comment';
import { ProductReviewRating } from '@shop-backend/product-review/domain/product-review-rating';
import { UserId } from '@shop-backend/user/domain/user-id';
import { ProductReviewCreated } from 'src/contexts/shop/product-review/domain/events/product-review-created';
import { ProductReview } from 'src/contexts/shop/product-review/domain/product-review';
import { ProductReviewId } from 'src/contexts/shop/product-review/domain/product-review-id';
import { ProductReviewRepository } from 'src/contexts/shop/product-review/domain/product-review-repository';

export class ProductReviewCreatedEventHandler implements DomainEventSubscriber<ProductReviewCreated> {
  public event = ProductReviewCreated.name;

  constructor(private repository: ProductReviewRepository) {}

  subscribedTo(): DomainEventClass[] {
    return [ProductReviewCreated];
  }

  async on(domainEvent: ProductReviewCreated): Promise<void> {
    const id = new ProductReviewId(domainEvent.aggregateId);
    const productId = new ProductId(domainEvent.productId);
    const userId = new UserId(domainEvent.userId);
    const rating = new ProductReviewRating(domainEvent.rating);
    const comment = new ProductReviewComment(domainEvent.comment);

    const productReview = new ProductReview(id, productId, userId, rating, comment, new Date());
    await this.repository.save(productReview);
  }
}
