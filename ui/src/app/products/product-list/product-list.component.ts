import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { fetchProducts } from 'src/app/store/products/products.actions';
import { selectProducts } from 'src/app/store/products/products.selectors';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  public isLoading = false;

  products$ = this.store.pipe(select(selectProducts));

  constructor(private store: Store) {}

  ngOnInit() {
    const params = {}; // TODO: add params query to the store action

    this.isLoading = false;

    this.store.dispatch(fetchProducts());
  }

  onNotify() {
    window.alert('You will be notified when the product goes on sale');
  }
}
