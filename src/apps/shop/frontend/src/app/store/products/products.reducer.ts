import {createReducer, on} from '@ngrx/store';

import {ProductsActions} from './products.actions';
import {productsInitialState, ProductsState} from './state/model';

import {LoadingStatus} from '../metadata-types';

export const productReducer = createReducer<ProductsState>(
    {...productsInitialState},
    on(ProductsActions.fetchProducts, (state) => {
        return {
            ...state,
            metadata: {
                ...state.metadata,
                loadingStatus: LoadingStatus.Loading,
            },
        };
    }),
    on(ProductsActions.fetchProductsSuccess, (state, {products}) => {
        return {
            ...state,
            products,
            metadata: {
                ...state.metadata,
                loadingStatus: LoadingStatus.Loaded,
            },
        };
    }),
    on(ProductsActions.fetchProductsFailure, (state, {error}) => {
        return {
            ...state,
            metadata: {
                ...state.metadata,
                error,
                loadingStatus: LoadingStatus.NotLoaded,
            },
        };
    }),
    on(ProductsActions.fetchSingleProduct, (state) => {
        return {
            ...state,
            metadata: {
                ...state.metadata,
                loadingStatus: LoadingStatus.Loading,
            },
        };
    }),
    on(ProductsActions.fetchSingleProductSuccess, (state, {product}) => {
        return {
            ...state,
            product,
            metadata: {
                ...state.metadata,
                loadingStatus: LoadingStatus.Loaded,
            },
        };
    }),
    on(ProductsActions.fetchSingleProductFailure, (state, {error}) => {
        return {
            ...state,
            metadata: {
                ...state.metadata,
                error,
                loadingStatus: LoadingStatus.NotLoaded,
            },
        };
    }),
);
