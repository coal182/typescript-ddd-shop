import { NumberValueObject } from '@shared/value-objects/number-value-object';

export class ProductPrice extends NumberValueObject {
  public constructor(value: number) {
    super(value);
  }
}
