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
import { Product } from '../products';

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

  ngOnInit() {
    console.log('oninit');
    const searchBoxElement = <HTMLInputElement>(
      document.getElementById('search-box-input')
    );
    const loadingElement = document.getElementById('loading');

    // loading state observable
    const loadingSubject = new Subject<boolean>();
    const loading$ = loadingSubject.asObservable().pipe(startWith(false));

    // loading event subscription
    loading$.subscribe((isLoading) => {
      loadingElement.style.display = isLoading ? 'block' : 'none';
    });

    // search composed observable
    const search$ = fromEvent(searchBoxElement, 'keyup').pipe(
      distinctUntilChanged(),
      debounceTime(300),
      tap(() => loadingSubject.next(true)),
      switchMap((event) =>
        this.productService.getProducts({
          name: searchBoxElement.value,
        })
      ),
      tap(() => loadingSubject.next(false))
    );

    // search subscription
    search$.subscribe((data) => {
      this.filteredProducts = data.data;
      console.log(data.data);
    });
  }

  constructor(public productService: HttpProductService) {}
}
