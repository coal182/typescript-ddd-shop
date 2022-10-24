import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { ProductService, GetProductParams } from './product.service';

@Injectable({
  providedIn: 'root',
})
export class HttpProductService extends ProductService {
  public constructor(private http: HttpClient) {
    super();
  }

  public getProducts(params): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    const parameters = new HttpParams().set('name', params?.name || '');
    return this.http.get(`${environment.apiUrl}api/v1/books`, { headers: headers, params: parameters });
  }

  public getProduct(params: GetProductParams): Observable<any> {
    return this.http.get(`${environment.apiUrl}api/v1/books/${params.id}`);
  }
}
