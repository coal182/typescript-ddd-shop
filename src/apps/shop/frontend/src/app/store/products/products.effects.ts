import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { catchError, map, mergeMap, of, withLatestFrom } from 'rxjs';

import { Operator } from 'src/app/products/interfaces/products.interface';
import { HttpProductService } from 'src/app/products/services/http-product.service';
import { GetProductsParams } from 'src/app/products/services/product.service';

import { ProductsActions } from './products.actions';
import { ProductSelectors } from './products.selectors';

@Injectable()
export class ProductsEffects {
  constructor(private actions$: Actions, private productsService: HttpProductService, private store: Store) {}

  fetchProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.fetchProducts),
      withLatestFrom(this.store.pipe(select(ProductSelectors.selectProducts))),
      mergeMap(([actionType, productFromStore]) => {
        const paramsObj: GetProductsParams = {
          'filters[0][field]': 'name',
          'filters[0][operator]': Operator.CONTAINS,
          'filters[0][value]': '*',
          orderBy: 'name',
          order: 'asc',
          limit: '30',
          offset: '0',
        };
        return this.productsService.getProducts(paramsObj).pipe(
          map((response) => ProductsActions.fetchProductsSuccess({ products: response.data })),
          catchError((error: Error) => of(ProductsActions.fetchProductsFailure({ error })))
        );
      })
    )
  );

  fetchSingleProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.fetchSingleProduct),
      withLatestFrom(this.store.pipe(select(ProductSelectors.selectSingleProduct))),
      mergeMap(([action, productFromStore]) => {
        return this.productsService.getProduct({ id: action.id }).pipe(
          map((response) => ProductsActions.fetchSingleProductSuccess({ product: response.data })),
          catchError((error: Error) => of(ProductsActions.fetchSingleProductFailure({ error })))
        );
      })
    )
  );
}
