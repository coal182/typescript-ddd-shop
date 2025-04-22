import {Component, OnInit} from '@angular/core';
import {map, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

import {Order} from '../../interfaces/orders';
import {HttpOrderService} from '../../services/http-order.service';

@Component({
    selector: 'app-order-list',
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.css'],
    standalone: false
})
export class OrderListComponent implements OnInit {
    public isLoading = false;

    columnsToDisplay = ['name', 'address', 'total', 'actions'];

    orders$: Observable<any>;

    constructor(public orderService: HttpOrderService) {}

    public ngOnInit(): void {
        this.isLoading = true;

        this.orders$ = this.orderService.getOrders().pipe(
            map((ord) => ord.data),
            tap(() => (this.isLoading = false)),
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public cancel(order: Order): void {
        // not implemented yet
    }
}
