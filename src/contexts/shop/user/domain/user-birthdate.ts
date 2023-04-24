import { DateValueObject } from '@shared/domain/value-objects/date-value-object';

export class UserBirthdate extends DateValueObject {
  public constructor(value: Date) {
    super(value);
  }
}
