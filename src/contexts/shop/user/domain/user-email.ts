import { InvalidArgumentError } from '@shared/domain/errors/invalid-argument-error';
import { StringValueObject } from '@shared/domain/value-objects/string-value-object';

import { InvalidUserEmail } from './invalid-user-email';

export class UserEmail extends StringValueObject {
  private readonly validEmailRegExp =
    /^(?=.*[@](?:gmail\.com|hotmail\.com|yahoo\.com)$)[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[a-zA-Z0-9_-]*$/;

  public constructor(value: string) {
    super(value);
    this.ensureLengthIsLessThan320Characters(value || '');
    this.ensureIsValidEmail(value);
  }

  private ensureLengthIsLessThan320Characters(value: string): void {
    if (value.length > 320) {
      throw new InvalidArgumentError(
        `The User Email <${value}> has more than 320 characters, (it has ${value.length})`
      );
    }
  }

  private ensureIsValidEmail(value: string): void {
    if (!this.validEmailRegExp.test(value)) {
      throw new InvalidUserEmail(`<${value}> is not a valid email`);
    }
  }
}
