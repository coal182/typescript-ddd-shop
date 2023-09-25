import { UserLastname } from 'src/contexts/shop/user/domain/user-lastname';
import { WordMother } from 'tests/contexts/shared/word-mother';

export class UserLastnameMother {
  static create(value: string): UserLastname {
    return new UserLastname(value);
  }

  static random(): UserLastname {
    return this.create(WordMother.random());
  }

  static invalid(): string {
    return 'a'.repeat(201);
  }
}
