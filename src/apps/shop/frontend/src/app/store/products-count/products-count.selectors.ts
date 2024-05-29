import {createFeatureSelector} from '@ngrx/store';

import {ProductsCountState} from './state/model';

export class ProductsCountSelectors {
    public static selectProductsCount = createFeatureSelector<ProductsCountState>('productsCount');
}
