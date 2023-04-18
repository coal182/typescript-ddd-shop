import { InvalidArgumentError } from '@shared/domain/errors/invalid-argument-error';
import { StringValueObject } from '@shared/value-objects/string-value-object';

export class BookDescription extends StringValueObject {
  public constructor(value: string) {
    super(value);
    this.ensureLengthIsLessThan1000Characters(value || '');
  }

  private ensureLengthIsLessThan1000Characters(value: string): void {
    if (value.length > 1000) {
      throw new InvalidArgumentError(
        `The Book Description <${value}> has more than 1000 characters, (it has ${value.length})`
      );
    }
  }
}
