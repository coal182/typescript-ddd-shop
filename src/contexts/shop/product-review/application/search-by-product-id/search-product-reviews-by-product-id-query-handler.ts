import {Query} from '@shared/domain/query';
import {QueryHandler} from '@shared/domain/query-handler';

import {ProductReviewsFinder} from './product-reviews-finder';
import {SearchProductReviewsByProductIdQuery} from './search-product-reviews-by-product-id-query';

import {ProductReviewsResponse} from '../product-review-response';

// eslint-disable-next-line prettier/prettier
export class SearchProductReviewsByProductIdQueryHandler implements QueryHandler<SearchProductReviewsByProductIdQuery, ProductReviewsResponse>
{
    constructor(private finder: ProductReviewsFinder) {}

    subscribedTo(): Query {
        return SearchProductReviewsByProductIdQuery;
    }

    async handle(query: SearchProductReviewsByProductIdQuery): Promise<ProductReviewsResponse> {
        const productReviews = await this.finder.run(query.productId);

        return new ProductReviewsResponse(productReviews);
    }
}
