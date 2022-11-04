import { Cart } from 'src/app/cart/cart';

import { LoadingStatus } from '../../metadata-types';

export const loginFeatureKey = 'login';

export const loginInitialState: LoginState = {
  access_token: null,
  user_id: null,
  cart: null,
  metadata: {
    loadingStatus: LoadingStatus.NotLoaded,
  },
};

export interface LoginState extends LoginData {
  metadata: { loadingStatus: LoadingStatus; error?: Error };
}

export interface LoginData {
  access_token: string;
  user_id: string;
  cart: Cart;
}

export interface Credentials {
  email: string;
  password: string;
}
