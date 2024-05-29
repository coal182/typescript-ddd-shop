import {HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpResponse, HttpEvent} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {StatusCodes} from 'http-status-codes';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {AuthService} from './auth.service';

import {environment} from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService,
        public router: Router,
    ) {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authToken = this.authService.getToken();
        req = req.clone({
            setHeaders: {
                Authorization: 'Bearer ' + authToken,
            },
        });

        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === StatusCodes.UNAUTHORIZED && error.url !== `${environment.apiUrl}login/signin`) {
                    this.authService.doLogout();
                    this.router.navigate(['/log-in']);
                }

                return throwError(() => error);
            }),
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    return event;
                }
            }),
        );
    }

    isClientSideError(error: HttpErrorResponse): boolean {
        return error.error instanceof ErrorEvent;
    }
}
