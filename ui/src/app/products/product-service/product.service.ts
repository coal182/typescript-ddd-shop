import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export abstract class ProductService {
  abstract getProducts(params: GetProductsParams): Observable<any>;
  abstract getProduct(params: GetProductParams): Observable<any>;
}

export interface GetProductsParams {
  name: string;
}
export interface GetProductParams {
  id: string;
}
