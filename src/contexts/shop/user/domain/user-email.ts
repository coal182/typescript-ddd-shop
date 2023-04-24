import { InvalidArgumentError } from '@shared/domain/errors/invalid-argument-error';
import { StringValueObject } from '@shared/domain/value-objects/string-value-object';

export class UserEmail extends StringValueObject {
  public constructor(value: string) {
    super(value);
    this.ensureLengthIsLessThan320Characters(value || '');
  }

  private ensureLengthIsLessThan320Characters(value: string): void {
    if (value.length > 320) {
      throw new InvalidArgumentError(
        `The User Email <${value}> has more than 320 characters, (it has ${value.length})`
      );
    }
  }
}
