import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpOrderService } from '../order-service/http-order.service';
import { Order } from '../orders';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  public isLoading = false;

  columnsToDisplay = ['name', 'address', 'total', 'actions'];

  orders$: Observable<any>;

  constructor(public orderService: HttpOrderService) { }

  ngOnInit() {
    const params = {};

    this.isLoading = true;

    this.orders$ = this.orderService
      .getOrders(params)
      .pipe(
        map((ord) => ord.data), 
        tap((ord) => (this.isLoading = false))
      );
  }

  cancel(order: Order): void {}

}
