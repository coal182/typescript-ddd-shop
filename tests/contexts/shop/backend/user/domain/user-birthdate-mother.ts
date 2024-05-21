import {UserBirthdate} from 'src/contexts/shop/user/domain/user-birthdate';
import {DateMother} from 'tests/contexts/shared/date-mother';

export class UserBirthdateMother {
    static create(value: Date): UserBirthdate {
        return new UserBirthdate(value);
    }

    static random(): UserBirthdate {
        return this.create(DateMother.random());
    }

    static invalid(): Date {
        return new Date('1900-01-01');
    }
}
