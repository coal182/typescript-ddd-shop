import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpOrderService } from '../order-service/http-order.service';
import { Order, OrderLine } from '../orders';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  columnsToDisplay = ['name', 'qty', 'price'];
  @ViewChild(MatTable) table!: MatTable<OrderLine>;

  order$: Observable<Order> | undefined;
  public isLoading = false;

  constructor(private route: ActivatedRoute, public orderService: HttpOrderService) { }

  ngOnInit() {
    const routeParams = this.route.snapshot.paramMap;
    const orderIdFromRoute: string = routeParams.get('orderId');

    const params = { id: orderIdFromRoute };

    this.isLoading = true;

    this.order$ = this.orderService
      .getOrder(params)
      .pipe(
        map((ord) => ord.data), 
        tap((ord) => (this.isLoading = false))
      );
  }

  cancel(order: Order): void {}

}
