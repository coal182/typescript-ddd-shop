import {ProductReview} from '../domain/product-review';

export class ProductReviewResponse {
    public readonly id: string;
    public readonly productId: string;
    public readonly userId: string;
    public readonly rating: number;
    public readonly comment: string;
    public readonly createdAt: Date;

    constructor(productReview: ProductReview) {
        const primitives = productReview.toPrimitives();
        return {
            id: primitives.id,
            productId: primitives.productId,
            userId: primitives.userId,
            rating: primitives.rating,
            comment: primitives.comment,
            createdAt: primitives.createdAt,
        };
    }
}

export class ProductReviewsResponse {
    public readonly productReviews: Array<ProductReviewResponse>;

    constructor(productReviews: Array<ProductReview>) {
        this.productReviews = productReviews.map((productReview) => new ProductReviewResponse(productReview));
    }
}
