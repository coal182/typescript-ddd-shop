import {AsyncPipe, CurrencyPipe} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTableModule} from '@angular/material/table';
import {RouterModule} from '@angular/router';
import {map, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

import {Order} from '../../interfaces/orders';
import {HttpOrderService} from '../../services/http-order.service';

@Component({
    selector: 'app-order-list',
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.css'],
    imports: [MatButtonModule, MatIconModule, MatTableModule, AsyncPipe, CurrencyPipe, MatProgressSpinnerModule, RouterModule],
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
