import { Product } from 'src/app/products/interfaces/products.interface';

import { LoadingStatus } from '../../metadata-types';

export const productsFeatureKey = 'products';

export const productsInitialState: ProductsState = {
  products: [],
  metadata: {
    loadingStatus: LoadingStatus.NotLoaded,
  },
};

export const singleProductInitialState: SingleProductState = {
  product: undefined,
  metadata: {
    loadingStatus: LoadingStatus.NotLoaded,
  },
};

export interface ProductsState {
  products: ReadonlyArray<Product>;
  metadata: { loadingStatus: LoadingStatus };
}

export interface SingleProductState {
  product: Product;
  metadata: { loadingStatus: LoadingStatus };
}
