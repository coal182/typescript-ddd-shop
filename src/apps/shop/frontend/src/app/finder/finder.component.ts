import {CurrencyPipe} from '@angular/common';
import {Component, OnDestroy} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HlmAutocompleteImports} from '@spartan-ng/helm/autocomplete';
import {HlmSpinnerImports} from '@spartan-ng/helm/spinner';
import {Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil, tap} from 'rxjs';

import {Operator, Product} from '../products/interfaces/products.interface';
import {HttpProductService} from '../products/services/http-product.service';
import {ImagePipe} from '../shared/pipes/image.pipe';

@Component({
    selector: 'finder',
    templateUrl: 'finder.component.html',
    styleUrls: ['finder.component.css'],
    imports: [RouterModule, CurrencyPipe, ImagePipe, ...HlmAutocompleteImports, ...HlmSpinnerImports],
})
export class FinderComponent implements OnDestroy {
    public filteredProducts: ReadonlyArray<Product> = [];
    public loading = false;

    private readonly search$ = new Subject<string>();
    private readonly destroy$ = new Subject<void>();

    constructor(public productService: HttpProductService) {
        this.search$
            .pipe(
                takeUntil(this.destroy$),
                distinctUntilChanged(),
                debounceTime(300),
                tap(() => (this.loading = true)),
                switchMap((term) => {
                    const paramsObj = {
                        'filters[0][field]': 'name',
                        'filters[0][operator]': Operator.CONTAINS,
                        'filters[0][value]': term !== '' ? term : ' ',
                        orderBy: 'name',
                        order: 'asc',
                        limit: '30',
                        offset: '0',
                    };
                    return this.productService.getProducts(paramsObj);
                }),
                tap(() => (this.loading = false)),
            )
            .subscribe((data) => {
                this.filteredProducts = data.data;
            });
    }

    public onSearchChange(term: string): void {
        this.search$.next(term);
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
