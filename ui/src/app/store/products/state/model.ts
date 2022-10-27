import { Product } from 'src/app/products/products';

import { LoadingStatus } from '../../metadata-types';

export const productsFeatureKey = 'outOfHomeInventory';

export const productsInitialState: ProductsState = {
  products: [],
  metadata: {
    loadingStatus: LoadingStatus.NotLoaded,
  },
};

export interface ProductsState {
  products: ReadonlyArray<Product>;
  metadata: { loadingStatus: LoadingStatus };
}
