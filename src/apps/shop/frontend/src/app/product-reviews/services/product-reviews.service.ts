import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductReviewsResponse } from '../interfaces/product-reviews.interface';

@Injectable({
  providedIn: 'root',
})
export abstract class ProductReviewsService {
  public abstract getProductReviews(productId: string): Observable<ProductReviewsResponse>;
  public abstract addProductReview(params: AddProductReviewParams): Observable<void>;
}

export interface AddProductReviewParams {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
}
