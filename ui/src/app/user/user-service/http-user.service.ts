import { Injectable } from '@angular/core';
import { firstValueFrom, map, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  UserService,
  GetUsersParams,
  GetUserParams,
  PutUserParams,
} from './user.service';

import { User } from '../user';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpUserService extends UserService {
  public constructor(private http: HttpClient) {
    super();
  }

  public getUsers(params): Observable<any> {
    let headers = { 'Content-Type': 'application/json' };
    let parameters = new HttpParams()
      .set('name', params?.name || '')
      .set('paramName2', 0); //Create new HttpParams
    return this.http.get(
      `${environment.apiUrl}api/v1/books`,
      { headers: headers, params: parameters }
    );
  }

  public getUser(params: GetUserParams): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}api/v1/users/${params.id}`
    );
  }

  public putUser(params: PutUserParams): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}api/v1/users/${params.id}`,
      params
    );
  }
}
