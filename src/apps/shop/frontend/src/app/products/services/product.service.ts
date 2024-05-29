import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ProductResponse, ProductsResponse} from '../interfaces/products.interface';

@Injectable({
    providedIn: 'root',
})
export abstract class ProductService {
    abstract getProducts(params: GetProductsParams): Observable<ProductsResponse>;
    abstract getProduct(params: GetProductParams): Observable<ProductResponse>;
}

export interface GetProductsParams {
    [key: `filters${string}`]: string;
    orderBy: string;
    order: string;
    limit: string;
    offset: string;
}
export interface GetProductParams {
    id: string;
}
