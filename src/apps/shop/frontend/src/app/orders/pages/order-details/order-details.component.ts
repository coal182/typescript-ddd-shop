import {AsyncPipe, CurrencyPipe} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HlmSpinnerImports} from '@spartan-ng/helm/spinner';
import {HlmTableImports} from '@spartan-ng/helm/table';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';

import {Order} from '../../interfaces/orders';
import {HttpOrderService} from '../../services/http-order.service';

@Component({
    selector: 'app-order-details',
    templateUrl: './order-details.component.html',
    styleUrls: ['./order-details.component.css'],
    imports: [AsyncPipe, CurrencyPipe, ...HlmTableImports, ...HlmSpinnerImports],
})
export class OrderDetailsComponent implements OnInit {
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
            tap(() => (this.isLoading = false)),
        );
    }

    public cancel(order: Order): void {}
}
