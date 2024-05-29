import {createFeatureSelector} from '@ngrx/store';

import {LoginState} from './state/model';

export class LoginSelectors {
    public static selectLogin = createFeatureSelector<LoginState>('login');
}
