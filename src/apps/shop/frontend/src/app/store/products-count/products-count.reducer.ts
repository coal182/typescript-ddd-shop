import { createReducer, on } from '@ngrx/store';

import { LoadingStatus } from '../metadata-types';

import { productsCountInitialState, ProductsCountState } from './state/model';
import { ProductsCountActions } from './products-count.actions';

export const productsCountReducer = createReducer<ProductsCountState>(
  { ...productsCountInitialState },
  on(ProductsCountActions.fetchProductsCount, (state) => {
    return {
      ...state,
      metadata: {
        ...state.metadata,
        loadingStatus: LoadingStatus.Loading,
      },
    };
  }),
  on(ProductsCountActions.fetchProductsCountSuccess, (state, { count }) => {
    return {
      ...state,
      count,
      metadata: {
        ...state.metadata,
        loadingStatus: LoadingStatus.Loaded,
      },
    };
  }),
  on(ProductsCountActions.fetchProductsCountFailure, (state, { error }) => {
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
