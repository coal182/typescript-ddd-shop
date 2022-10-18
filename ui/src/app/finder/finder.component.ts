import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, fromEvent, Subject } from 'rxjs';
import {
  map,
  startWith,
  filter,
  tap,
  switchMap,
  debounceTime,
  withLatestFrom,
  distinctUntilChanged,
} from 'rxjs/operators';

import { HttpProductService } from '../products/product-service/http-product.service';
import { Product } from '../products/products';

export interface State {
  flag: string;
  name: string;
  population: string;
}

/**
 * @title Autocomplete overview
 */
@Component({
  selector: 'finder',
  templateUrl: 'finder.component.html',
  styleUrls: ['finder.component.css'],
})
export class FinderComponent {
  filteredProducts: Product[];
  loading = false;

  ngOnInit() {
    const searchBoxElement = <HTMLInputElement>document.getElementById('search-box-input');

    // search composed observable
    const search$ = fromEvent(searchBoxElement, 'keyup').pipe(
      distinctUntilChanged(),
      debounceTime(300),
      tap(() => (this.loading = true)),
      switchMap((event) =>
        this.productService.getProducts({
          name: searchBoxElement.value,
        })
      ),
      tap(() => (this.loading = false))
    );

    // search subscription
    search$.subscribe((data) => {
      this.filteredProducts = data.data;
    });
  }

  constructor(public productService: HttpProductService) {}
}
