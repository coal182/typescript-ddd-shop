import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { StatusCodes } from 'http-status-codes';
import { map, Observable, Subject, throwError } from 'rxjs';
import { catchError, tap, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { CartItem } from 'src/app/cart/interfaces/cart';
import { LoadingStatus } from 'src/app/store/metadata-types';
import { ProductsActions } from 'src/app/store/products/products.actions';
import { ProductSelectors } from 'src/app/store/products/products.selectors';

import { AlertDialogComponent } from '../../../alert-dialog/alert-dialog.component';
import { HttpCartService } from '../../../cart/services/http-cart.service';
import { HttpProductService } from '../../services/http-product.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject();
  public isLoading = false;

  product$ = this.store.pipe(
    select(ProductSelectors.selectSingleProduct),
    tap((product) => {
      /*eslint indent: ["error", 2, {"SwitchCase": 1}]*/
      switch (product.metadata.loadingStatus) {
        case LoadingStatus.Loaded:
          this.isLoading = false;
          break;
        case LoadingStatus.Loading:
          this.isLoading = true;
          break;
        case LoadingStatus.NotLoaded:
          this.isLoading = false;
      }
    }),
    map((product) => product.product)
  );

  constructor(
    private route: ActivatedRoute,
    public productService: HttpProductService,
    private cartService: HttpCartService,
    private readonly dialog: MatDialog,
    private store: Store
  ) {}

  ngOnInit(): void {
    // First get the product id from the current route.
    const routeParams = this.route.snapshot.paramMap;
    const productIdFromRoute: string = routeParams.get('productId');

    const params = { id: productIdFromRoute };

    this.isLoading = true;

    this.store.dispatch(ProductsActions.fetchSingleProduct(params));
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  addToCart() {
    this.product$
      .pipe(
        takeUntil(this.onDestroy$),
        map((pro): CartItem => ({ product: pro, qty: 1, price: pro.price }))
      )
      .subscribe((item: CartItem) => {
        this.cartService
          .addToCart(item)
          .pipe(
            catchError((error: HttpErrorResponse): Observable<Error> => {
              if (error.status === StatusCodes.UNAUTHORIZED) {
                Swal.fire('Error!', 'There was an error adding this product!', 'error');
              }
              return throwError(() => error);
            })
          )
          .subscribe((res: any) => {
            Swal.fire({
              title: 'Product added',
              html: 'Your product has been added to the cart!',
              icon: 'success',
              toast: true,
              position: 'top-right',
              iconColor: '#286f00',
              customClass: {
                popup: 'colored-toast',
              },
              showConfirmButton: false,
              timer: 1500,
              timerProgressBar: true,
            });
          });
      });
  }

  share() {
    this.isLoading = true;

    setTimeout(() => {
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        data: { title: 'Sharing Product', msg: 'The product has been shared!' },
      });

      this.isLoading = false;
    }, 1000);
  }
}
