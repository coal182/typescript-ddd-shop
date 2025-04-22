import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {StorageService} from 'src/app/shared/services/storage.service';

import {OrderService, GetOrderParams} from './order.service';

import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class HttpOrderService extends OrderService {
    public constructor(
        private http: HttpClient,
        private storageService: StorageService,
    ) {
        super();
    }

    public getOrders(): Observable<any> {
        const userId = this.storageService.getItem('user_id');

        return this.http.get(`${environment.apiUrl}order/user/${userId}`);
    }

    public getOrder(params: GetOrderParams): Observable<any> {
        return this.http.get(`${environment.apiUrl}order/${params.id}`);
    }
}
