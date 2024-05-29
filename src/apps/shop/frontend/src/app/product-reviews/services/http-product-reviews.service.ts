import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';

import {ProductReviewBody, ProductReviewsService} from './product-reviews.service';

import {ProductReviewsResponse} from '../interfaces/product-reviews.interface';

@Injectable({
    providedIn: 'root',
})
export class HttpProductReviewsService extends ProductReviewsService {
    public constructor(private http: HttpClient) {
        super();
    }

    public get(productId: string): Observable<ProductReviewsResponse> {
        const headers: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
        return this.http.get<ProductReviewsResponse>(`${environment.apiUrl}product-review/product/${productId}`, {
            headers,
        });
    }

    public create(body: ProductReviewBody): Observable<void> {
        const headers: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
        return this.http.post<void>(`${environment.apiUrl}product-review`, body, {headers});
    }

    public update(body: ProductReviewBody): Observable<void> {
        const headers: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
        return this.http.put<void>(`${environment.apiUrl}product-review`, body, {headers});
    }
}
