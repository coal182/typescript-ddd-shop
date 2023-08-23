import { UserRepository } from '@shop-backend/user/domain/user-repository';

export class UsersFinder {
  constructor(private userRepository: UserRepository) {}

  async run() {
    const users = await this.userRepository.searchAll();

    return users;
  }
}
