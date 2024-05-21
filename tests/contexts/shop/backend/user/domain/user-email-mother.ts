import {UserEmail} from 'src/contexts/shop/user/domain/user-email';
import {EmailMother} from 'tests/contexts/shared/email-mother';

export class UserEmailMother {
    static create(value: string): UserEmail {
        return new UserEmail(value);
    }

    static random(): UserEmail {
        return this.create(EmailMother.random());
    }

    static invalid(): string {
        return 'not-an-email';
    }
}
