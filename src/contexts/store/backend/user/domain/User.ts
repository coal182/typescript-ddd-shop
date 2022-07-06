import { AggregateRoot } from '@core/AggregateRoot';

import { UserCreated } from './events/UserCreated';
import { UserPasswordChanged } from './events/UserPasswordChanged';
import { UserUpdated } from './events/UserUpdated';

export class User extends AggregateRoot {
  private _email: string;
  private _firstname: string;
  private _lastname: string;
  private _dateOfBirth: Date;
  private _password: string;

  get email() {
    return this._email;
  }

  get firstname() {
    return this._firstname;
  }

  get lastname() {
    return this._lastname;
  }

  get dateOfBirth() {
    return this._dateOfBirth;
  }

  get password() {
    return this._password;
  }

  constructor();

  constructor(guid: string, email: string, firstname: string, lastname: string, dateOfBirth: Date, password: string);

  constructor(
    guid?: string,
    email?: string,
    firstname?: string,
    lastname?: string,
    dateOfBirth?: Date,
    password?: string
  ) {
    super();
    if (email && firstname && lastname && dateOfBirth && password) {
      this.applyChange(new UserCreated(this.guid, email, firstname, lastname, dateOfBirth, password));
    }
  }

  public updateUser(email: string, firstname: string, lastname: string, dateOfBirth: Date) {
    this._email = email;
    this._firstname = firstname;
    this._lastname = lastname;
    this._dateOfBirth = dateOfBirth;
    this.applyChange(new UserUpdated(this.guid, email, firstname, lastname, dateOfBirth));
  }

  public applyUserUpdated(event: UserUpdated): void {
    this._email = event.email;
    this._firstname = event.firstname;
    this._lastname = event.lastname;
    this._dateOfBirth = event.dateOfBirth;
  }

  public changePassword(password: string) {
    this._password = password;
    this.applyChange(new UserPasswordChanged(this.guid, password));
  }

  public applyUserPasswordChanged(event: UserPasswordChanged): void {
    this._password = event.password;
  }

  public applyUserCreated(event: UserCreated): void {
    this.guid = event.guid; // Important for set changes to the right aggregate guid
    this._email = event.email;
    this._firstname = event.firstname;
    this._lastname = event.lastname;
    this._dateOfBirth = event.dateOfBirth;
    this._password = event.password;
  }
}