import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, map, of, tap } from 'rxjs';

import { ProductsActions } from 'src/app/store/products/products.actions';
import { Product } from '../../interfaces/products.interface';
import { LoadingStatus } from 'src/app/store/metadata-types';
import { ProductSelectors } from 'src/app/store/products/products.selectors';
import { ProductsCountSelectors } from 'src/app/store/products-count/products-count.selectors';
import { ProductsCountActions } from 'src/app/store/products-count/products-count.actions';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  public isLoading = true;

  public products$: Observable<ReadonlyArray<Product>>;
  public productsCount$: Observable<number> = of(0);

  constructor(private store: Store) {
    this.getProducts();
    this.getProductsCount();
  }

  ngOnInit() {
    const params = {}; // TODO: add params query to the store action

    this.store.dispatch(ProductsActions.fetchProducts());
    this.store.dispatch(ProductsCountActions.fetchProductsCount());
  }

  getProducts(){
    this.products$ = this.store.pipe(
      select(ProductSelectors.selectProducts),
      tap((products) => {
        /*eslint indent: ["error", 2, {"SwitchCase": 1}]*/
        switch (products.metadata.loadingStatus) {
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
      map((products) => products.products)
    );
  }

  getProductsCount(){
    this.productsCount$ = this.store.pipe(
      select(ProductsCountSelectors.selectProductsCount),
      map((productsCount) => productsCount.count)
    )
  }

  onNotify() {
    window.alert('You will be notified when the product goes on sale');
  }
}
