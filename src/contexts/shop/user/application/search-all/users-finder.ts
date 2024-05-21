import {User} from '@shop-backend/user/domain/user';
import {UserRepository} from '@shop-backend/user/domain/user-repository';

export class UsersFinder {
    constructor(private userRepository: UserRepository) {}

    async run(): Promise<ReadonlyArray<User>> {
        const users = await this.userRepository.searchAll();

        return users;
    }
}
