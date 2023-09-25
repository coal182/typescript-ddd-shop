import { UserPassword } from '@shop-backend/user/domain/user-password';
import { PasswordMother } from 'tests/contexts/shared/password-mother';

export class UserPasswordMother {
  static create(value: string): UserPassword {
    return new UserPassword(value);
  }

  static random(): UserPassword {
    return this.create(PasswordMother.random());
  }

  static invalid(): string {
    return '';
  }
}
