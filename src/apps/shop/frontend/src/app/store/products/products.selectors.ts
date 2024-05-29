import {createFeatureSelector} from '@ngrx/store';

import {ProductsState, SingleProductState} from './state/model';

export class ProductSelectors {
    public static selectProducts = createFeatureSelector<ProductsState>('products');
    public static selectSingleProduct = createFeatureSelector<SingleProductState>('products');
}
