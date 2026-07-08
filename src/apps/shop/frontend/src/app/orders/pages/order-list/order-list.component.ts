import {AsyncPipe, CurrencyPipe} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NgIconComponent} from '@ng-icons/core';
import {HlmButtonImports} from '@spartan-ng/helm/button';
import {HlmSpinnerImports} from '@spartan-ng/helm/spinner';
import {HlmTableImports} from '@spartan-ng/helm/table';
import {map, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

import {Order} from '../../interfaces/orders';
import {HttpOrderService} from '../../services/http-order.service';

@Component({
    selector: 'app-order-list',
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.css'],
    imports: [AsyncPipe, CurrencyPipe, RouterModule, NgIconComponent, ...HlmButtonImports, ...HlmSpinnerImports, ...HlmTableImports],
})
export class OrderListComponent implements OnInit {
    public isLoading = false;

    orders$: Observable<Order[]>;

    constructor(public orderService: HttpOrderService) {}

    public ngOnInit(): void {
        this.isLoading = true;

        this.orders$ = this.orderService.getOrders().pipe(
            map((ord) => ord.data),
            tap(() => (this.isLoading = false)),
        );
    }

    public cancel(order: Order): void {}
}
