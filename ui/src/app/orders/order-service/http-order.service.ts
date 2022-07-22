import { Injectable } from '@angular/core';
import { firstValueFrom, map, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  OrderService,
  GetOrdersParams,
  GetOrderParams,
} from './order.service';

import { Order } from '../orders';

@Injectable({
  providedIn: 'root',
})
export class HttpOrderService extends OrderService {
  public constructor(private http: HttpClient) {
    super();
  }

  public getOrders(params): Observable<any> {
    let headers = { 'Content-Type': 'application/json' };
    let parameters = new HttpParams()
      .set('name', params?.name || '');
    const userId = localStorage.getItem('user_id');

    return this.http.get(
      `https://ts-bookstore-api.herokuapp.com/api/v1/orders/user/${userId}`,
      { headers: headers, params: parameters }
    );
  }

  public getOrder(params: GetOrderParams): Observable<any> {
    return this.http.get(
      `https://ts-bookstore-api.herokuapp.com/api/v1/orders/${params.id}`
    );
  }
}
