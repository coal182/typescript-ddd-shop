import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { OrderService, GetOrderParams } from './order.service';
import { StorageService } from 'src/app/shared/services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class HttpOrderService extends OrderService {
  public constructor(private http: HttpClient, private storageService: StorageService) {
    super();
  }

  public getOrders(params): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    const parameters = new HttpParams().set('name', params?.name || '');
    const userId = this.storageService.getItem('user_id');

    return this.http.get(`${environment.apiUrl}order/user/${userId}`, { headers: headers, params: parameters });
  }

  public getOrder(params: GetOrderParams): Observable<any> {
    return this.http.get(`${environment.apiUrl}order/${params.id}`);
  }
}
