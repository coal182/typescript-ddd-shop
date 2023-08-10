import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { map, tap } from 'rxjs';

import { LoadingStatus } from 'src/app/store/metadata-types';
import { ProductsActions } from 'src/app/store/products/products.actions';
import { ProductSelectors } from 'src/app/store/products/products.selectors';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  public isLoading = true;

  products$ = this.store.pipe(
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

  constructor(private store: Store) {}

  ngOnInit() {
    const params = {}; // TODO: add params query to the store action

    this.store.dispatch(ProductsActions.fetchProducts());
  }

  onNotify() {
    window.alert('You will be notified when the product goes on sale');
  }
}
