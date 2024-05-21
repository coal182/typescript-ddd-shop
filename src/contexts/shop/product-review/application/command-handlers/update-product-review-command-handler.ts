import {NotFoundException} from '@domain/errors/application-error';
import {EventBus} from '@domain/event-bus';
import {Command} from '@shared/domain/command';
import {CommandHandler} from '@shared/domain/command-handler';
import {ProductId} from '@shared/product/domain/product-id';
import {ProductReview} from '@shop-backend/product-review/domain/product-review';
import {ProductReviewComment} from '@shop-backend/product-review/domain/product-review-comment';
import {ProductReviewEventStore} from '@shop-backend/product-review/domain/product-review-event-store';
import {ProductReviewId} from '@shop-backend/product-review/domain/product-review-id';
import {ProductReviewRating} from '@shop-backend/product-review/domain/product-review-rating';
import {UserId} from '@shop-backend/user/domain/user-id';

import {UpdateProductReviewCommand} from '../commands/update-product-review';

export class UpdateProductReviewCommandHandler implements CommandHandler<UpdateProductReviewCommand> {
    constructor(
        private eventBus: EventBus,
        private eventStore: ProductReviewEventStore,
    ) {}

    subscribedTo(): Command {
        return UpdateProductReviewCommand;
    }

    async handle(command: UpdateProductReviewCommand): Promise<void> {
        const id = new ProductReviewId(command.id);
        const productId = new ProductId(command.productId);
        const userId = new UserId(command.userId);
        const rating = new ProductReviewRating(command.rating);
        const comment = new ProductReviewComment(command.comment);

        const events = await this.eventStore.findByAggregateId(id);
        if (!events) {
            throw new NotFoundException('Product review not found by its id');
        }

        const productReview = ProductReview.initialize(id);
        productReview.loadFromHistory(events);
        productReview.updateProductReview(productId, userId, rating, comment);
        const newDomainEvents = productReview.pullDomainEvents();
        await this.eventStore.save(newDomainEvents);
        await this.eventBus.publish(newDomainEvents);
    }
}
