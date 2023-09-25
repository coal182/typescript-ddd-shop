import { MotherCreator } from './mother-creator';

export class DateMother {
  static random(): Date {
    return MotherCreator.random().date.birthdate();
  }
}
