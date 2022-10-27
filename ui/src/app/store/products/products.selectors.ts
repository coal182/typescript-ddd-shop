import { createFeatureSelector } from '@ngrx/store';

import { Product } from 'src/app/products/products';

export const selectProducts = createFeatureSelector<Product[]>('products');
