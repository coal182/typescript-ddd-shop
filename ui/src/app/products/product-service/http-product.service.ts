import { Injectable } from '@angular/core';
import { firstValueFrom, map, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  ProductService,
  GetProductsParams,
  GetProductParams,
} from './product.service';

import { Product } from '../products';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpProductService extends ProductService {
  public constructor(private http: HttpClient) {
    super();
  }

  public getProducts(params): Observable<any> {
    let headers = { 'Content-Type': 'application/json' };
    let parameters = new HttpParams()
      .set('name', params?.name || '');
    return this.http.get(
      `${environment.apiUrl}api/v1/books`,
      { headers: headers, params: parameters }
    );
  }

  public getProduct(params: GetProductParams): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}api/v1/books/${params.id}`
    );
  }
}
