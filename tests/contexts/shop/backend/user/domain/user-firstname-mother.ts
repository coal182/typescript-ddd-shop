import {UserFirstname} from 'src/contexts/shop/user/domain/user-firstname';
import {WordMother} from 'tests/contexts/shared/word-mother';

export class UserFirstnameMother {
    static create(value: string): UserFirstname {
        return new UserFirstname(value);
    }

    static random(): UserFirstname {
        return this.create(WordMother.random());
    }

    static invalid(): string {
        return 'a'.repeat(201);
    }
}
