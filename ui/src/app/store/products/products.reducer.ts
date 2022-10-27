import { createReducer, on } from '@ngrx/store';

import { LoadingStatus } from '../metadata-types';

import { ProductsActions } from './products.actions';
import { productsInitialState, ProductsState } from './state/model';

export const productReducer = createReducer<ProductsState>(
  { ...productsInitialState },
  on(ProductsActions.fetchProducts, (state) => {
    return {
      ...state,
      metadata: {
        ...state.metadata,
        loadingStatus: LoadingStatus.Loading,
      },
    };
  }),
  on(ProductsActions.fetchProductsSuccess, (state, { products }) => {
    return {
      ...state,
      products,
      metadata: {
        ...state.metadata,
        loadingStatus: LoadingStatus.Loaded,
      },
    };
  }),
  on(ProductsActions.fetchProductsFailure, (state, { error }) => {
    return {
      ...state,
      metadata: {
        ...state.metadata,
        error,
        loadingStatus: LoadingStatus.NotLoaded,
      },
    };
  })
);
