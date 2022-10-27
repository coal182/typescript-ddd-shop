import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { catchError, EMPTY, map, mergeMap, of, tap, withLatestFrom } from 'rxjs';

import { HttpProductService } from 'src/app/products/product-service/http-product.service';

import { fetchProducts, fetchProductsFailure, fetchProductsSuccess } from './products.actions';
import { selectProducts } from './products.selectors';

@Injectable()
export class ProductsEffect {
  constructor(private actions$: Actions, private productsService: HttpProductService, private store: Store) {}

  fetchProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchProducts),
      withLatestFrom(this.store.pipe(select(selectProducts))),
      mergeMap(([actionType, productFromStore]) => {
        if (productFromStore.length > 0) {
          return EMPTY;
        }
        return this.productsService.getProducts({ name: '' }).pipe(
          map((response) => fetchProductsSuccess({ products: response.data })),
          catchError((error: Error) => of(fetchProductsFailure({ error })))
        );
      })
    )
  );
}
