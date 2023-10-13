import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { catchError, map, mergeMap, of, withLatestFrom } from 'rxjs';

import { HttpProductService } from 'src/app/products/services/http-product.service';

import { ProductsCountActions } from './products-count.actions';
import { ProductsCountSelectors } from './products-count.selectors';

@Injectable()
export class ProductsCountEffects {
  constructor(private actions$: Actions, private productsService: HttpProductService, private store: Store) {}

  fetchProductsCount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsCountActions.fetchProductsCount),
      withLatestFrom(this.store.pipe(select(ProductsCountSelectors.selectProductsCount))),
      mergeMap(([action, productsCountFromStore]) => {
        return this.productsService.getProductCount().pipe(
          map((response) => ProductsCountActions.fetchProductsCountSuccess({ count: response.total })),
          catchError((error: Error) => of(ProductsCountActions.fetchProductsCountFailure({ error })))
        );
      
      })
    )
  );
}
