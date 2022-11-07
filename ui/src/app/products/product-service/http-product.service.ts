import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Operator, ProductsResponse } from '../products';

import { ProductService, GetProductParams } from './product.service';

@Injectable({
  providedIn: 'root',
})
export class HttpProductService extends ProductService {
  public constructor(private http: HttpClient) {
    super();
  }

  //TODO: Use params for query instead of harcoding them
  public getProducts(params): Observable<ProductsResponse> {
    const headers = { 'Content-Type': 'application/json' };
    const parameters = new HttpParams()
      .set('filters[0][field]', 'name')
      .set('filters[0][operator]', Operator.CONTAINS)
      .set('filters[0][value]', ' ')
      .set('orderBy', 'name')
      .set('order', 'asc')
      .set('limit', '30')
      .set('offset', '0');
    return this.http.get<ProductsResponse>(`${environment.apiUrl}api/v1/books`, {
      headers: headers,
      params: parameters,
    });
  }

  public getProduct(params: GetProductParams): Observable<any> {
    return this.http.get(`${environment.apiUrl}api/v1/books/${params.id}`);
  }
}
