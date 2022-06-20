import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpResponse,
  HttpEvent,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AuthService } from './auth.service';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, public router: Router) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.authService.getToken();
    req = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + authToken,
      },
    });

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = '';
        if (this.isClientSideError(error)) {
          errorMsg = `Error: ${error.error.message}`;
        } else {
          if (
            error.error.message === 'Invalid auth token provided. TokenExpiredError: jwt expired' &&
            error.status === 400 &&
            error.url !== 'https://ts-bookstore-api.herokuapp.com/api/v1/login/signin'
          ) {
            this.authService.doLogout();
            this.router.navigate(['/login']);
          }
          errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
        }

        return throwError(errorMsg);
      }),
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          return event;
        }
      })
    );
  }

  isClientSideError(error: HttpErrorResponse): boolean {
    return error.error instanceof ErrorEvent;
  }
}
