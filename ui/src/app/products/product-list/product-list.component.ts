import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { StatusCodes } from 'http-status-codes';
import { firstValueFrom, map, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CartItem } from 'src/app/cart/cart';
import { HttpCartService } from 'src/app/cart/cart-service/http-cart.service';
import Swal from 'sweetalert2';
import { HttpProductService } from '../product-service/http-product.service';
import { Product } from '../products';

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

    this.products$ = this.productService
      .getProducts(params)
      .pipe(
        map((pro) => pro.data), 
        tap((pro) => (this.isLoading = false))
      );
  }

  ngAfterViewInit(): void {}

  onNotify() {
    window.alert('You will be notified when the product goes on sale');
  }

}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
