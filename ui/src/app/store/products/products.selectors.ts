import { createFeatureSelector } from '@ngrx/store';

import { ProductsState } from './state/model';

export class ProductSelectors {
  public static selectProducts = createFeatureSelector<ProductsState>('products');
}
