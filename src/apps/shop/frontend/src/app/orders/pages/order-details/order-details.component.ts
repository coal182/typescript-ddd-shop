import {AsyncPipe, CurrencyPipe} from '@angular/common';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTable, MatTableModule} from '@angular/material/table';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';

import {Order, OrderLine} from '../../interfaces/orders';
import {HttpOrderService} from '../../services/http-order.service';

@Component({
    selector: 'app-order-details',
    templateUrl: './order-details.component.html',
    styleUrls: ['./order-details.component.css'],
    imports: [MatTableModule, AsyncPipe, CurrencyPipe, MatProgressSpinnerModule],
})
export class OrderDetailsComponent implements OnInit {
    public columnsToDisplay = ['name', 'qty', 'price'];
    @ViewChild(MatTable)
    public table!: MatTable<OrderLine>;

    public order$: Observable<Order> | undefined;
    public isLoading = false;

    public constructor(
        private route: ActivatedRoute,
        public orderService: HttpOrderService,
    ) {}

    public ngOnInit(): void {
        const routeParams = this.route.snapshot.paramMap;
        const orderIdFromRoute: string = routeParams.get('orderId');

        const params = {id: orderIdFromRoute};

        this.isLoading = true;

        this.order$ = this.orderService.getOrder(params).pipe(
            map((ord) => ord.data),
            tap((data) => console.log(data)),
            tap(() => (this.isLoading = false)),
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public cancel(order: Order): void {
        // not implemented yet
    }
}
