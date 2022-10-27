import { createAction, props } from '@ngrx/store';

import { Product } from 'src/app/products/products';

export const fetchProducts = createAction('[Products] Fetch products');

export const fetchProductsSuccess = createAction('[Products] Fetch products Success', props<{ products: Product[] }>());

export const fetchProductsFailure = createAction('[Products] Fetch products Failure', props<{ error: Error }>());
