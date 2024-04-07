import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductReviewsResponse } from '../interfaces/product-reviews.interface';

@Injectable({
  providedIn: 'root',
})
export abstract class ProductReviewsService {
  public abstract get(productId: string): Observable<ProductReviewsResponse>;
  public abstract create(params: ProductReviewBody): Observable<void>;
  public abstract update(params: ProductReviewBody): Observable<void>;
}

export interface ProductReviewBody {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
}
