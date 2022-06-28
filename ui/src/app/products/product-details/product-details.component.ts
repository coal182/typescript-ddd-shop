import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, map, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { AlertDialogComponent } from '../../alert-dialog/alert-dialog.component';
import { HttpCartService } from '../../cart/cart-service/http-cart.service';
import { Product } from '../products';
import { HttpProductService } from '../product-service/http-product.service';

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

    const params = { _id: productIdFromRoute };

    this.isLoading = true;

    this.product$ = this.productService.getProduct(params).pipe(
      map((data) => data.data),
      tap((pro) => (this.isLoading = false))
      );
  }

  addToCart() {
    this.cartService.addToCart(this.product$.pipe(map((pro) => pro)));    
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
