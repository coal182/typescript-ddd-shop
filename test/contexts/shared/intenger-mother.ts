import { MotherCreator } from './mother-creator';

export class IntegerMother {
  static random(max?: number): number {
    return MotherCreator.random().random.number({ max });
  }
}
