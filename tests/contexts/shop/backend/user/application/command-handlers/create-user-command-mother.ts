import {CreateUserCommand} from '@shop-backend/user/application/commands/create-user';
import {UserBirthdate} from '@shop-backend/user/domain/user-birthdate';
import {UserEmail} from '@shop-backend/user/domain/user-email';
import {UserFirstname} from '@shop-backend/user/domain/user-firstname';
import {UserId} from '@shop-backend/user/domain/user-id';
import {UserLastname} from '@shop-backend/user/domain/user-lastname';
import {UserPassword} from '@shop-backend/user/domain/user-password';

import {UserBirthdateMother} from '../../domain/user-birthdate-mother';
import {UserEmailMother} from '../../domain/user-email-mother';
import {UserFirstnameMother} from '../../domain/user-firstname-mother';
import {UserIdMother} from '../../domain/user-id-mother';
import {UserLastnameMother} from '../../domain/user-lastname-mother';
import {UserPasswordMother} from '../../domain/user-password-mother';

export class CreateUserCommandMother {
    static create(
        id: UserId,
        email: UserEmail,
        firstname: UserFirstname,
        lastname: UserLastname,
        dateOfBirth: UserBirthdate,
        password: UserPassword,
    ): CreateUserCommand {
        return {
            id: id.value,
            email: email.value,
            firstname: firstname.value,
            lastname: lastname.value,
            dateOfBirth: dateOfBirth.value,
            password: password.value,
        };
    }

    static random(): CreateUserCommand {
        return this.create(
            UserIdMother.random(),
            UserEmailMother.random(),
            UserFirstnameMother.random(),
            UserLastnameMother.random(),
            UserBirthdateMother.random(),
            UserPasswordMother.random(),
        );
    }

    static randomWithId(id: string): CreateUserCommand {
        return this.create(
            UserIdMother.create(id),
            UserEmailMother.random(),
            UserFirstnameMother.random(),
            UserLastnameMother.random(),
            UserBirthdateMother.random(),
            UserPasswordMother.random(),
        );
    }

    static invalidEmail(): CreateUserCommand {
        return {
            id: UserIdMother.random().value,
            email: UserEmailMother.invalid(),
            firstname: UserFirstnameMother.random().value,
            lastname: UserLastnameMother.random().value,
            dateOfBirth: UserBirthdateMother.random().value,
            password: UserPasswordMother.random().value,
        };
    }
}
