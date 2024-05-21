import {Criteria} from '@domain/criteria/criteria';
import {Filter} from '@domain/criteria/filter';
import {FilterField} from '@domain/criteria/filter-field';
import {FilterOperator, Operator} from '@domain/criteria/filter-operator';
import {FilterValue} from '@domain/criteria/filter-value';
import {Filters} from '@domain/criteria/filters';
import {Order} from '@domain/criteria/order';
import {OrderBy} from '@domain/criteria/order-by';
import {OrderType, OrderTypes} from '@domain/criteria/order-type';
import {ProductId} from '@shared/product/domain/product-id';
import {ProductReview} from '@shop-backend/product-review/domain/product-review';
import {ProductReviewByProductIdNotFound} from '@shop-backend/product-review/domain/product-review-by-product-id-not-found';
import {ProductReviewRepository} from '@shop-backend/product-review/domain/product-review-repository';

export class ProductReviewsFinder {
    constructor(private productReviewRepository: ProductReviewRepository) {}

    async run(id: ProductId): Promise<ProductReview[]> {
        const filter = new Filter(new FilterField('productId'), new FilterOperator(Operator.EQUAL), new FilterValue(id.toString()));
        const criteria = new Criteria(new Filters([filter]), new Order(new OrderBy('createdAt'), new OrderType(OrderTypes.DESC)));

        const productReviews = await this.productReviewRepository.matching(criteria);

        if (!productReviews) {
            throw new ProductReviewByProductIdNotFound(id.toString());
        }

        return productReviews;
    }
}
