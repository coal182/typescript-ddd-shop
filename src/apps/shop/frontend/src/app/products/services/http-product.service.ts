import { HttpClient, HttpParams, HttpUrlEncodingCodec } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ProductService, GetProductParams, GetProductsParams} from './product.service';

import {environment} from '../../../environments/environment';
import {ProductResponse, ProductsCountResponse, ProductsResponse} from '../interfaces/products.interface';

@Injectable({
    providedIn: 'root',
})
export class HttpProductService extends ProductService {
    public constructor(private http: HttpClient) {
        super();
    }

    public getProducts(paramsObj: GetProductsParams): Observable<ProductsResponse> {
        const headers = {'Content-Type': 'application/json'};
        const params = new HttpParams({fromObject: {...paramsObj}, encoder: new HttpUrlEncodingCodec()});
        return this.http.get<ProductsResponse>(`${environment.apiUrl}product/criteria`, {
            headers: headers,
            params,
        });
    }

    public getProduct(params: GetProductParams): Observable<ProductResponse> {
        return this.http.get<ProductResponse>(`${environment.apiUrl}product/${params.id}`);
    }

    public getProductCount(): Observable<ProductsCountResponse> {
        return this.http.get<ProductsCountResponse>(`${environment.apiUrl}products-counter`);
    }
}
