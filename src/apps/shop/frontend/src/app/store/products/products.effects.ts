import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {catchError, map, mergeMap, of, withLatestFrom} from 'rxjs';
import {Operator} from 'src/app/products/interfaces/products.interface';
import {HttpProductService} from 'src/app/products/services/http-product.service';
import {GetProductsParams} from 'src/app/products/services/product.service';

import {ProductsActions} from './products.actions';
import {ProductSelectors} from './products.selectors';

@Injectable()
export class ProductsEffects {
    constructor(
        private actions$: Actions,
        private productsService: HttpProductService,
        private store: Store,
    ) {}

    fetchProducts$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProductsActions.fetchProducts),
            mergeMap((action) => {
                const paramsObj = this.buildParamsObj(action);

                return this.productsService.getProducts(paramsObj).pipe(
                    map((response) => ProductsActions.fetchProductsSuccess({products: response.data})),
                    catchError((error: Error) => of(ProductsActions.fetchProductsFailure({error}))),
                );
            }),
        ),
    );

    fetchSingleProduct$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProductsActions.fetchSingleProduct),
            withLatestFrom(this.store.pipe(select(ProductSelectors.selectSingleProduct))),
            mergeMap(([action]) => {
                return this.productsService.getProduct({id: action.id}).pipe(
                    map((response) => ProductsActions.fetchSingleProductSuccess({product: response.data})),
                    catchError((error: Error) => of(ProductsActions.fetchSingleProductFailure({error}))),
                );
            }),
        ),
    );

    private buildParamsObj(action): GetProductsParams {
        const filters = [
            {
                field: 'name',
                operator: Operator.CONTAINS,
                value: '*',
            },
        ];

        if (action.payload.filters) {
            action.payload.filters.forEach((filter) => {
                filters.push({field: filter.category.toString(), operator: Operator.ONE_OF, value: filter.selection.join('|')});
            });
        }

        return filters.reduce(
            (params, filter, index) => {
                params[`filters[${index}][field]`] = filter.field.toLowerCase();
                params[`filters[${index}][operator]`] = filter.operator;
                params[`filters[${index}][value]`] = filter.value;
                return params;
            },
            {
                orderBy: 'name',
                order: 'asc',
                limit: '200',
                offset: '0',
            },
        );
    }
}
