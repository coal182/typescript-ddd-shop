import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export abstract class OrderService {
  abstract getOrders(params: GetOrdersParams): Observable<any>;
  abstract getOrder(params: GetOrderParams): Observable<any>;
}

export interface GetOrdersParams {
  name: string;
}
export interface GetOrderParams {
  id: string;
}
