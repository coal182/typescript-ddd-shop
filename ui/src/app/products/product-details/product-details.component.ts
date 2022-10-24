import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { StatusCodes } from 'http-status-codes';
import { map, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { CartItem } from 'src/app/cart/cart';

import { AlertDialogComponent } from '../../alert-dialog/alert-dialog.component';
import { HttpCartService } from '../../cart/cart-service/http-cart.service';
import { HttpProductService } from '../product-service/http-product.service';
import { Product } from '../products';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product$: Observable<Product> | undefined;
  public isLoading = false;

  constructor(
    private route: ActivatedRoute,
    public productService: HttpProductService,
    private cartService: HttpCartService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // First get the product id from the current route.
    const routeParams = this.route.snapshot.paramMap;
    const productIdFromRoute: string = routeParams.get('productId');

    const params = { id: productIdFromRoute };

    this.isLoading = true;

    this.product$ = this.productService.getProduct(params).pipe(
      map((data) => data.data),
      tap((pro) => (this.isLoading = false))
    );
  }

  addToCart() {
    this.product$
      .pipe(map((pro): CartItem => ({ product: pro, qty: 1, price: pro.price })))
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
        data: { title: 'Sharing Book', msg: 'The product has been shared!' },
      });

      this.isLoading = false;
    }, 1000);
  }
}
