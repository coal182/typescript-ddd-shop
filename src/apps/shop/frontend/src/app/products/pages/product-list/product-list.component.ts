import {Component, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {RouterModule} from '@angular/router';
import {Store, select} from '@ngrx/store';
import {FilterBarComponent, ResultWithFilterableFields, Selection} from 'ngx-coal';
import {BehaviorSubject, Subject, map, takeUntil, tap} from 'rxjs';
import {ImagePipe} from 'src/app/shared/pipes/image.pipe';
import {SharedModule} from 'src/app/shared/shared.module';
import {LoadingStatus} from 'src/app/store/metadata-types';
import {ProductsActions} from 'src/app/store/products/products.actions';
import {ProductSelectors} from 'src/app/store/products/products.selectors';
import {ProductsState} from 'src/app/store/products/state/model';
import {ProductsCountActions} from 'src/app/store/products-count/products-count.actions';
import {ProductsCountSelectors} from 'src/app/store/products-count/products-count.selectors';

import {Product} from '../../interfaces/products.interface';

const AVAILABLE_FILTER_CATEGORIES = ['brand', 'category'] as const;

@Component({
    imports: [FilterBarComponent, SharedModule, RouterModule, ImagePipe],
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit, OnDestroy {
    public isLoading = true;
    public products$ = new BehaviorSubject<ReadonlyArray<Product>>([]);
    public productsCount$ = new BehaviorSubject(0);
    public resultsWithFilterableFields$: WritableSignal<ReadonlyArray<ResultWithFilterableFields>> = signal([
        {title: '', filterableFields: {brand: '', category: ''}},
    ]);

    private destroySubject$ = new Subject();

    constructor(private store: Store) {}

    public ngOnInit(): void {
        this.store.dispatch(ProductsActions.fetchProducts());
        this.store.dispatch(ProductsCountActions.fetchProductsCount());
        this.getProducts();
        this.getProductsCount();
    }

    public ngOnDestroy(): void {
        this.destroySubject$.next(null);
    }

    public onFilterSelection(selectedFilters: Selection): void {
        this.store.dispatch(ProductsActions.fetchProducts({filters: selectedFilters}));
        this.store.dispatch(ProductsCountActions.fetchProductsCount());
    }

    public onNotify(): void {
        window.alert('You will be notified when the product goes on sale');
    }

    private getProducts(): void {
        this.store
            .pipe(
                takeUntil(this.destroySubject$),
                select(ProductSelectors.selectProducts),
                tap((products) => {
                    this.handleLoadingStatus(products);
                }),
                map((products) => products.products),
                tap((products) => this.buildResultsWithFilterableFields(products)),
            )
            .subscribe((products) => {
                this.products$.next(products);
            });
    }

    private handleLoadingStatus(products: ProductsState): void {
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
    }

    private buildResultsWithFilterableFields(products: ReadonlyArray<Product>): void {
        const resultsWithFilterableFields = products.map((product) => ({
            title: product.name,
            filterableFields: AVAILABLE_FILTER_CATEGORIES.reduce((filterableFields, filterCategory) => {
                return {
                    ...filterableFields,
                    [filterCategory]: product[filterCategory],
                };
            }, {}),
        }));
        this.resultsWithFilterableFields$.set(resultsWithFilterableFields);
    }

    private getProductsCount(): void {
        this.store
            .pipe(
                select(ProductsCountSelectors.selectProductsCount),
                map((productsCount) => productsCount.count),
            )
            .subscribe((count) => this.productsCount$.next(count));
    }
}
