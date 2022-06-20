import { Injectable } from '@angular/core';
import { firstValueFrom, map, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  ProductService,
  GetProductsParams,
  GetProductParams,
} from './product.service';

import { Product } from '../../products';

@Injectable({
  providedIn: 'root',
})
export class HttpProductService extends ProductService {
  public constructor(private http: HttpClient) {
    super();
  }

  public getProducts(params): Observable<any> {
    console.log(params);
    let headers = { 'Content-Type': 'application/json' };
    let parameters = new HttpParams()
      .set('name', params?.name || '')
      .set('paramName2', 0); //Create new HttpParams
    return this.http.get(
      'https://ts-bookstore-api.herokuapp.com/api/v1/books',
      { headers: headers, params: parameters }
    );
  }

  public getProduct(params: GetProductParams): Observable<any> {
    return this.http.get(
      `https://ts-bookstore-api.herokuapp.com/api/v1/books/${params._id}`
    );
  }
}
