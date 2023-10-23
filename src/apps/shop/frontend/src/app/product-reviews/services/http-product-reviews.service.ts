import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { ProductReviewsResponse } from '../interfaces/product-reviews.interface';

import { AddProductReviewParams, ProductReviewsService } from './product-reviews.service';

@Injectable({
  providedIn: 'root',
})
export class HttpProductReviewsService extends ProductReviewsService {
  public constructor(private http: HttpClient) {
    super();
  }

  public getProductReviews(productId: string): Observable<ProductReviewsResponse> {
    const headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<ProductReviewsResponse>(`${environment.apiUrl}product-review/product/${productId}`, {
      headers,
    });
  }
  public addProductReview(params: AddProductReviewParams): Observable<void> {
    const headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<void>(`${environment.apiUrl}product-review`, params, { headers });
  }
}
