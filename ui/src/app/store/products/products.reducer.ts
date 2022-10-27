import { createReducer, on } from '@ngrx/store';

import { Product } from 'src/app/products/products';

import { fetchProductsSuccess } from './products.actions';

export const initialState: ReadonlyArray<Product> = [];

export const productReducer = createReducer(
  initialState,
  on(fetchProductsSuccess, (state, { products }) => {
    return products;
  })
);
