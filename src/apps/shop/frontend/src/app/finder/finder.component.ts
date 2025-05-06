import {CurrencyPipe} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {RouterModule} from '@angular/router';
import {fromEvent} from 'rxjs';
import {tap, switchMap, debounceTime, distinctUntilChanged} from 'rxjs/operators';

import {Operator, Product} from '../products/interfaces/products.interface';
import {HttpProductService} from '../products/services/http-product.service';
import {ImagePipe} from '../shared/pipes/image.pipe';

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
    imports: [MatAutocompleteModule, MatInputModule, MatFormFieldModule, RouterModule, CurrencyPipe, ImagePipe, MatProgressSpinnerModule],
})
export class FinderComponent implements OnInit {
    filteredProducts: Product[];
    loading = false;

    ngOnInit(): void {
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
            tap(() => (this.loading = false)),
        );

        // search subscription
        search$.subscribe((data) => {
            this.filteredProducts = data.data;
        });
    }

    constructor(public productService: HttpProductService) {}
}
