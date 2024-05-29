import {createAction, props} from '@ngrx/store';

import {Credentials, LoginData} from './state/model';

export class LoginActions {
    public static signIn = createAction('[Login] Sign In', props<{credentials: Credentials}>());

    public static signInSuccess = createAction('[Login] Sign In Success', props<{login: LoginData}>());

    public static signInFailure = createAction('[Login] Sign In Failure', props<{error: Error}>());

    public static logOut = createAction('[Login] Log Out');
}
