import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { HttpCartService } from 'src/app/cart/cart-service/http-cart.service';

import { HttpProductService } from '../product-service/http-product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  public isLoading = false;

  products$: Observable<any>;

  constructor(public productService: HttpProductService, private cartService: HttpCartService) {}

  ngOnInit() {
    const params = {};

    this.isLoading = true;

    this.products$ = this.productService.getProducts(params).pipe(
      map((pro) => pro.data),
      tap(() => (this.isLoading = false))
    );
  }

  onNotify() {
    window.alert('You will be notified when the product goes on sale');
  }
}
