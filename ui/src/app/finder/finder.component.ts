import { Component } from '@angular/core';
import { fromEvent } from 'rxjs';
import { tap, switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { Operator, Product } from '../products/interfaces/products.interface';
import { HttpProductService } from '../products/services/http-product.service';

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
      switchMap(() => {
        const paramsObj = {
          'filters[0][field]': 'name',
          'filters[0][operator]': Operator.CONTAINS,
          'filters[0][value]': searchBoxElement.value != '' ? searchBoxElement.value : ' ',
          orderBy: 'name',
          order: 'asc',
          limit: '30',
          offset: '0',
        };
        return this.productService.getProducts(paramsObj);
      }),
      tap(() => (this.loading = false))
    );

    // search subscription
    search$.subscribe((data) => {
      this.filteredProducts = data.data;
    });
  }

  constructor(public productService: HttpProductService) {}
}
