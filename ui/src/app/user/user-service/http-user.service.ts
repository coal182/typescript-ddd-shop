import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { UserService, GetUserParams, PutUserParams } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class HttpUserService extends UserService {
  public constructor(private http: HttpClient) {
    super();
  }

  public getUsers(params): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    const parameters = new HttpParams().set('name', params?.name || '').set('paramName2', 0); //Create new HttpParams
    return this.http.get(`${environment.apiUrl}api/v1/books`, { headers: headers, params: parameters });
  }

  public getUser(params: GetUserParams): Observable<any> {
    return this.http.get(`${environment.apiUrl}api/v1/users/${params.id}`);
  }

  public putUser(params: PutUserParams): Observable<any> {
    return this.http.put(`${environment.apiUrl}api/v1/users/${params.id}`, params);
  }
}
