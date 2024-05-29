import {HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {StatusCodes} from 'http-status-codes';
import {catchError, map, mergeMap, of, tap} from 'rxjs';
import {AuthService} from 'src/app/shared/auth/auth.service';

import {LoginActions} from './login.actions';

@Injectable()
export class LoginEffects {
    constructor(
        private actions$: Actions,
        private authService: AuthService,
        private router: Router,
    ) {}

    signIn$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoginActions.signIn),
            mergeMap((action) => {
                return this.authService.signIn(action.credentials).pipe(
                    map((response) =>
                        LoginActions.signInSuccess({
                            login: {access_token: response.data.token, user_id: response.data.id, cart: response.data.cart},
                        }),
                    ),
                    catchError((error: HttpErrorResponse) => {
                        switch (error.status) {
                            case StatusCodes.UNAUTHORIZED:
                                return of(LoginActions.signInFailure({error: new Error('You have entered an invalid password!')}));
                            default:
                                return of(LoginActions.signInFailure({error: new Error('Something went wrong')}));
                        }
                    }),
                );
            }),
        ),
    );

    logOut$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(LoginActions.logOut),
                tap(() => {
                    this.authService.doLogout();
                    this.router.navigate(['log-in']);
                }),
            ),
        {dispatch: false}, // to avoid infinite loop redispatching the action
    );
}
