import {HttpErrorResponse, HttpResponse, HttpEvent, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {StatusCodes} from 'http-status-codes';
import {throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {AuthService} from './auth.service';

import {environment} from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService: AuthService = inject(AuthService);
    const router: Router = inject(Router);
    const authToken = authService.getToken();
    req = req.clone({
        setHeaders: {
            Authorization: 'Bearer ' + authToken,
        },
    });

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === StatusCodes.UNAUTHORIZED && error.url !== `${environment.apiUrl}login/signin`) {
                authService.doLogout();
                router.navigate(['/log-in']);
            }

            return throwError(() => error);
        }),
        map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                return event;
            }
        }),
    );
};
