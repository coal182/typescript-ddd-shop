
import { LoadingStatus } from '../../metadata-types';

export const productsCountFeatureKey = 'productsCount';

export const productsCountInitialState: ProductsCountState = {
  count: 0,
  metadata: {
    loadingStatus: LoadingStatus.NotLoaded,
  },
};

export interface ProductsCountState {
  count: number;
  metadata: { loadingStatus: LoadingStatus };
}
