import { InvalidArgumentError } from '../../shared/invalid-argument-error';
import { NumberValueObject } from '../../shared/number-value-object';

export class BookPrice extends NumberValueObject {
  public constructor(value: number) {
    super(value);
  }
}
