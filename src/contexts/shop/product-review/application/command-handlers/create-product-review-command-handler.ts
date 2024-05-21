import {Command} from '@shared/domain/command';
import {CommandHandler} from '@shared/domain/command-handler';
import {ProductId} from '@shared/product/domain/product-id';
import {ProductReviewComment} from '@shop-backend/product-review/domain/product-review-comment';
import {ProductReviewId} from '@shop-backend/product-review/domain/product-review-id';
import {ProductReviewRating} from '@shop-backend/product-review/domain/product-review-rating';
import {UserId} from '@shop-backend/user/domain/user-id';

import {CreateProductReviewCommand} from '../commands/create-product-review';
import {ProductReviewCreator} from '../create/product-review-creator';

export class CreateProductReviewCommandHandler implements CommandHandler<CreateProductReviewCommand> {
    constructor(private productReviewCreator: ProductReviewCreator) {}

    subscribedTo(): Command {
        return CreateProductReviewCommand;
    }

    async handle(command: CreateProductReviewCommand): Promise<void> {
        const id = new ProductReviewId(command.id);
        const productId = new ProductId(command.productId);
        const userId = new UserId(command.userId);
        const rating = new ProductReviewRating(command.rating);
        const comment = new ProductReviewComment(command.comment);
        await this.productReviewCreator.run({id, productId, userId, rating, comment});
    }
}
