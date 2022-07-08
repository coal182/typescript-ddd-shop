import { InvalidArgumentError } from '@shared/value-objects/invalid-argument-error';
import { NumberValueObject } from '@shared/value-objects/number-value-object';

export class BookPrice extends NumberValueObject {
  public constructor(value: number) {
    super(value);
  }
}
