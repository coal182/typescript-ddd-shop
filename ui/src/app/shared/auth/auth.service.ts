import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Credentials } from 'src/app/store/login/state/model';

import { environment } from '../../../environments/environment';
import { User } from '../user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  endpoint = `${environment.apiUrl}`;
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};

  constructor(private http: HttpClient, public router: Router) {}

  get isLoggedIn(): boolean {
    const authToken = localStorage.getItem('access_token');
    return authToken !== null && authToken !== 'null' && authToken !== 'undefined' ? true : false;
  }

  signUp(user: User): Observable<any> {
    const api = `${this.endpoint}login/register-user`;
    return this.http.post(api, user).pipe(catchError(this.handleError));
  }

  signIn(credentials: Credentials) {
    return this.http.post<any>(`${this.endpoint}login/signin`, credentials);
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  doLogout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('cart');
  }

  getUserProfile(id: any): Observable<any> {
    const api = `${this.endpoint}users/${id}`;
    return this.http.get(api, { headers: this.headers }).pipe(
      map((res) => {
        return res || {};
      }),
      catchError(this.handleError)
    );
  }

  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    return throwError(() => msg);
  }
}
