import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export abstract class UserService {
  abstract getUser(params: GetUserParams): Observable<any>;
  abstract putUser(params: PutUserParams): Observable<any>;
}

export interface GetUserParams {
  id: string;
}
export interface PutUserParams {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  dateOfBirth: string;
}
