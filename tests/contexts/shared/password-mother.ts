import { MotherCreator } from './mother-creator';

export class PasswordMother {
  static random(): string {
    return MotherCreator.random().internet.password();
  }
}
