import { NotFoundException } from '@domain/errors/application-error';
import { DomainEventClass } from '@shared/domain/domain-event';
import { DomainEventSubscriber } from '@shared/domain/domain-event-subscriber';
import { ProductId } from '@shared/product/domain/product-id';
import { ProductReviewComment } from '@shop-backend/product-review/domain/product-review-comment';
import { ProductReviewEventStore } from '@shop-backend/product-review/domain/product-review-event-store';
import { ProductReviewRating } from '@shop-backend/product-review/domain/product-review-rating';
import { UserId } from '@shop-backend/user/domain/user-id';
import { ProductReviewUpdated } from 'src/contexts/shop/product-review/domain/events/product-review-updated';
import { ProductReview } from 'src/contexts/shop/product-review/domain/product-review';
import { ProductReviewId } from 'src/contexts/shop/product-review/domain/product-review-id';
import { ProductReviewRepository } from 'src/contexts/shop/product-review/domain/product-review-repository';

export class ProductReviewUpdatedEventHandler implements DomainEventSubscriber<ProductReviewUpdated> {
  public event = ProductReviewUpdated.name;

  constructor(private repository: ProductReviewRepository, private eventStore: ProductReviewEventStore) {}

  subscribedTo(): DomainEventClass[] {
    return [ProductReviewUpdated];
  }

  async on(domainEvent: ProductReviewUpdated): Promise<void> {
    const id = new ProductReviewId(domainEvent.aggregateId);
    const productId = new ProductId(domainEvent.productId);
    const userId = new UserId(domainEvent.userId);
    const rating = new ProductReviewRating(domainEvent.rating);
    const comment = new ProductReviewComment(domainEvent.comment);

    const events = await this.eventStore.findByAggregateId(id);
    if (!events) {
      throw new NotFoundException('User not found by its id');
    }

    const productReview = ProductReview.initialize(id);
    productReview.loadFromHistory(events);
    productReview.updateProductReview(productId, userId, rating, comment);

    await this.repository.save(productReview);
  }
}
