import { Injectable } from '@angular/core';
import { User } from '../user';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { StatusCodes } from 'http-status-codes';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  endpoint: string = 'https://ts-bookstore-api.herokuapp.com/api/v1';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};
  constructor(private http: HttpClient, public router: Router) {}
  // Sign-up
  signUp(user: User): Observable<any> {
    let api = `${this.endpoint}/login/register-user`;
    return this.http.post(api, user).pipe(catchError(this.handleError));
  }
  // Sign-in
  signIn(user: User) {
    return this.http
      .post<any>(`${this.endpoint}/login/signin`, user)
      .pipe(
        catchError((error: HttpErrorResponse): Observable<Error> => {
          if (error.status === StatusCodes.UNAUTHORIZED) {
            Swal.fire(
              'Error!',
              'You have entered an invalid email or password!',
              'error'
            );
          }
          return throwError(() => error);
        })
      )
      .subscribe((res: any) => {
        localStorage.setItem('access_token', res.data.token);
        localStorage.setItem('user_id', res.data.id);
        this.getUserProfile(res.data.id).subscribe({
          next: (res) => {
            this.currentUser = res;
            Swal.fire(
              `Hello !`,
              'You have been signed up correctly! ',
              'success'
            );
            this.router.navigate(['products']);
          } 
        });
      })
  }
  getToken() {
    return localStorage.getItem('access_token');
  }
  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return authToken !== null ? true : false;
  }
  doLogout() {
    let removeToken = localStorage.removeItem('access_token');
    let removeUserId = localStorage.removeItem('user_id');
    let removeCartId = localStorage.removeItem('cart_id');
    if (removeToken == null && removeUserId == null && removeCartId == null) {
      this.router.navigate(['log-in']);
    }
  }
  // User profile
  getUserProfile(id: any): Observable<any> {
    let api = `${this.endpoint}/users/${id}`;
    return this.http.get(api, { headers: this.headers }).pipe(
      map((res) => {
        return res || {};
      }),
      catchError(this.handleError)
    );
  }
  // Error
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    return throwError(msg);
  }
}
