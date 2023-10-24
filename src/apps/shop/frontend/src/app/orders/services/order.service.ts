import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export abstract class OrderService {
  abstract getOrders(): Observable<any>;
  abstract getOrder(params: GetOrderParams): Observable<any>;
}

export interface GetOrderParams {
  id: string;
}
