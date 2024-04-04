import { AggregateRoot } from '@shared/domain/aggregate-root';
import { DomainEvent } from '@shared/domain/domain-event';

import { UserCreated } from './events/user-created';
import { UserPasswordChanged } from './events/user-password-changed';
import { UserUpdated } from './events/user-updated';
import { UserBirthdate } from './user-birthdate';
import { UserEmail } from './user-email';
import { UserFirstname } from './user-firstname';
import { UserId } from './user-id';
import { UserLastname } from './user-lastname';
import { UserPassword } from './user-password';

export interface UserPrimitives {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  dateOfBirth: Date;
  password: string;
}

export interface UserInterface {
  id: UserId;
  email: UserEmail;
  firstname: UserFirstname;
  lastname: UserLastname;
  dateOfBirth: UserBirthdate;
  password: UserPassword;
}

export class User extends AggregateRoot {
  private email: UserEmail;
  private firstname: UserFirstname;
  private lastname: UserLastname;
  private dateOfBirth: UserBirthdate;
  private password: UserPassword;

  constructor(
    id: UserId,
    email: UserEmail,
    firstname: UserFirstname,
    lastname: UserLastname,
    dateOfBirth: UserBirthdate,
    password: UserPassword
  );

  constructor(
    id: UserId,
    email: UserEmail,
    firstname: UserFirstname,
    lastname: UserLastname,
    dateOfBirth: UserBirthdate,
    password: UserPassword
  ) {
    super();
    this.id = id;
    this.email = email;
    this.firstname = firstname;
    this.lastname = lastname;
    this.dateOfBirth = dateOfBirth;
    this.password = password;
  }

  static create(
    id: UserId,
    email: UserEmail,
    firstname: UserFirstname,
    lastname: UserLastname,
    dateOfBirth: UserBirthdate,
    password: UserPassword
  ): User {
    const user = new User(id, email, firstname, lastname, dateOfBirth, password);

    user.record(
      new UserCreated({
        aggregateId: user.id.value,
        email: user.email.value,
        firstname: user.firstname.value,
        lastname: user.lastname.value,
        dateOfBirth: user.dateOfBirth.value,
        password: user.password.value,
      })
    );

    return user;
  }

  static initialize(id: UserId): User {
    const email = new UserEmail('emptyuser@gmail.com');
    const firstname = new UserFirstname('');
    const lastname = new UserLastname('');
    const dateOfBirth = new UserBirthdate(new Date());
    const password = new UserPassword('');

    return new User(id, email, firstname, lastname, dateOfBirth, password);
  }

  public updateUser(email: UserEmail, firstname: UserFirstname, lastname: UserLastname, dateOfBirth: UserBirthdate) {
    this.email = email;
    this.firstname = firstname;
    this.lastname = lastname;
    this.dateOfBirth = dateOfBirth;
    this.record(
      new UserUpdated({
        aggregateId: this.id.value,
        email: email.value,
        firstname: firstname.value,
        lastname: lastname.value,
        dateOfBirth: dateOfBirth.toString(),
      })
    );
  }

  public applyUserUpdated(event: UserUpdated): void {
    this.email = new UserEmail(event.email);
    this.firstname = new UserFirstname(event.firstname);
    this.lastname = new UserLastname(event.lastname);
    this.dateOfBirth = new UserBirthdate(new Date(event.dateOfBirth));
  }

  public changePassword(password: UserPassword) {
    this.password = password;
    this.record(new UserPasswordChanged({ aggregateId: this.id.value, password: password.value }));
  }

  public applyUserPasswordChanged(event: UserPasswordChanged): void {
    this.password = new UserPassword(event.password);
  }

  public applyUserCreated(event: UserCreated): void {
    this.id = new UserId(event.aggregateId); // Important for set changes to the right aggregate id
    this.email = new UserEmail(event.email);
    this.firstname = new UserFirstname(event.firstname);
    this.lastname = new UserLastname(event.lastname);
    this.dateOfBirth = new UserBirthdate(new Date(event.dateOfBirth));
    this.password = new UserPassword(event.password);
  }

  static fromPrimitives(plainData: UserPrimitives): User {
    return new User(
      new UserId(plainData.id),
      new UserEmail(plainData.email),
      new UserFirstname(plainData.firstname),
      new UserLastname(plainData.lastname),
      new UserBirthdate(new Date(plainData.dateOfBirth)),
      new UserPassword(plainData.password)
    );
  }

  toPrimitives(): UserPrimitives {
    return {
      id: this.id.value,
      email: this.email.value,
      firstname: this.firstname.value,
      lastname: this.lastname.value,
      dateOfBirth: this.dateOfBirth.value,
      password: this.password.value,
    };
  }

  applyEvent(event: DomainEvent): void {
    /*eslint indent: ["error", 2, {"SwitchCase": 1}]*/
    switch (event.eventName) {
      case 'user.created':
        this.applyUserCreated(event as UserCreated);
        break;
      case 'user.updated':
        this.applyUserUpdated(event as UserUpdated);
        break;
      case 'user.password_changed':
        this.applyUserPasswordChanged(event as UserPasswordChanged);
        break;
      default:
        throw new Error(`Unsupported event: ${event.eventName}`);
    }
  }
}
