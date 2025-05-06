export interface ProductReview {
    id: string;
    productId: string;
    userId: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface ProductReviewResponseData {
    id: string;
    productId: string;
    userId: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface ProductReviewResponse {
    status: number;
    message: string;
    data: ProductReviewResponseData;
}

export interface ProductReviewsResponse {
    status: number;
    message: string;
    data: ProductReviewResponseData[];
}
