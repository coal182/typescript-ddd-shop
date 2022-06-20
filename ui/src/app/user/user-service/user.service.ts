import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export abstract class UserService {
  abstract getUsers(params: GetUsersParams): Observable<any>;
  abstract getUser(params: GetUserParams): Observable<any>;
}

export interface GetUsersParams {
  name: string;
}
export interface GetUserParams {
  _id: string;
}
export interface PutUserParams {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  dateOfBirth: string;
  version: number;
}
