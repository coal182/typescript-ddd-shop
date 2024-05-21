import {UserId} from 'src/contexts/shop/user/domain/user-id';
import {UuidMother} from 'tests/contexts/shared/uuid-mother';

export class UserIdMother {
    static create(value: string): UserId {
        return new UserId(value);
    }

    static creator(): () => UserIdMother {
        return () => UserIdMother.random();
    }

    static random(): UserId {
        return this.create(UuidMother.random());
    }
}
