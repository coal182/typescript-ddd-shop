import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {UserService, GetUserParams, PutUserParams} from './user.service';

import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class HttpUserService extends UserService {
    public constructor(private http: HttpClient) {
        super();
    }

    public getUser(params: GetUserParams): Observable<any> {
        return this.http.get(`${environment.apiUrl}user/${params.id}`);
    }

    public putUser(params: PutUserParams): Observable<any> {
        return this.http.put(`${environment.apiUrl}user/${params.id}/update`, params);
    }
}
