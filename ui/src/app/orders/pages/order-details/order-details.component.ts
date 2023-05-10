import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Order, OrderLine } from '../../interfaces/orders';
import { HttpOrderService } from '../../services/http-order.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
})
export class OrderDetailsComponent implements OnInit {
  columnsToDisplay = ['name', 'qty', 'price'];
  @ViewChild(MatTable) table!: MatTable<OrderLine>;

  order$: Observable<Order> | undefined;
  public isLoading = false;

  constructor(private route: ActivatedRoute, public orderService: HttpOrderService) {}

  ngOnInit() {
    const routeParams = this.route.snapshot.paramMap;
    const orderIdFromRoute: string = routeParams.get('orderId');

    const params = { id: orderIdFromRoute };

    this.isLoading = true;

    this.order$ = this.orderService.getOrder(params).pipe(
      map((ord) => ord.data),
      tap((data) => console.log(data)),
      tap(() => (this.isLoading = false))
    );
  }

  cancel(order: Order): void {
    // not implemented yet
  }
}
