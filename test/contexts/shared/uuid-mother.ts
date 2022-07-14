import { MotherCreator } from './mother-creator';

export class UuidMother {
  static random(): string {
    return MotherCreator.random().datatype.uuid();
  }
}
