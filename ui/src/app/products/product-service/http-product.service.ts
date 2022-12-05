import { HttpClient, HttpParams, HttpUrlEncodingCodec } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Operator, ProductResponse, ProductsResponse } from '../products';

import { ProductService, GetProductParams, GetProductsParams } from './product.service';

@Injectable({
  providedIn: 'root',
})
export class HttpProductService extends ProductService {
  public constructor(private http: HttpClient) {
    super();
  }

  public getProducts(paramsObj: GetProductsParams): Observable<ProductsResponse> {
    const headers = { 'Content-Type': 'application/json' };
    const params = new HttpParams({ fromObject: { ...paramsObj }, encoder: new HttpUrlEncodingCodec() });
    return this.http.get<ProductsResponse>(`${environment.apiUrl}api/v1/books`, {
      headers: headers,
      params,
    });
  }

  public getProduct(params: GetProductParams): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${environment.apiUrl}api/v1/books/${params.id}`);
  }
}
