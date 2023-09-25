import { CreateUserCommand } from '@shop-backend/user/application/commands/create-user';
import { UserBirthdate } from '@shop-backend/user/domain/user-birthdate';
import { UserEmail } from '@shop-backend/user/domain/user-email';
import { UserFirstname } from '@shop-backend/user/domain/user-firstname';
import { UserLastname } from '@shop-backend/user/domain/user-lastname';
import { UserPassword } from '@shop-backend/user/domain/user-password';
import { User } from 'src/contexts/shop/user/domain/user';
import { UserId } from 'src/contexts/shop/user/domain/user-id';

import { UserBirthdateMother } from './user-birthdate-mother';
import { UserEmailMother } from './user-email-mother';
import { UserFirstnameMother } from './user-firstname-mother';
import { UserIdMother } from './user-id-mother';
import { UserLastnameMother } from './user-lastname-mother';
import { UserPasswordMother } from './user-password-mother';

export class UserMother {
  static create(
    id: UserId,
    email: UserEmail,
    firstname: UserFirstname,
    lastname: UserLastname,
    dateOfBirth: UserBirthdate,
    password: UserPassword
  ): User {
    return new User(id, email, firstname, lastname, dateOfBirth, password);
  }

  static from(command: CreateUserCommand): User {
    return this.create(
      UserIdMother.create(command.id),
      UserEmailMother.create(command.email),
      UserFirstnameMother.create(command.firstname),
      UserLastnameMother.create(command.lastname),
      UserBirthdateMother.create(command.dateOfBirth),
      UserPasswordMother.create(command.password)
    );
  }

  static random(): User {
    return this.create(
      UserIdMother.random(),
      UserEmailMother.random(),
      UserFirstnameMother.random(),
      UserLastnameMother.random(),
      UserBirthdateMother.random(),
      UserPasswordMother.random()
    );
  }
}
