import { createReducer, on } from '@ngrx/store';

import { LoadingStatus } from '../metadata-types';

import { LoginActions } from './login.actions';
import { loginInitialState, LoginState } from './state/model';

export const loginReducer = createReducer<LoginState>(
  { ...loginInitialState },
  on(LoginActions.signIn, (state) => {
    return {
      ...state,
      metadata: {
        ...state.metadata,
        loadingStatus: LoadingStatus.Loading,
      },
    };
  }),
  on(LoginActions.signInSuccess, (state, { login }) => {
    return {
      ...state,
      ...login,
      metadata: {
        ...state.metadata,
        loadingStatus: LoadingStatus.Loaded,
      },
    };
  }),
  on(LoginActions.signInFailure, (state, { error }) => {
    return {
      ...state,
      metadata: {
        ...state.metadata,
        error,
        loadingStatus: LoadingStatus.NotLoaded,
      },
    };
  }),
  on(LoginActions.logOut, () => {
    return loginInitialState;
  })
);
