import { NumberValueObject } from '@shared/domain/value-objects/number-value-object';

export class BackofficeProductPrice extends NumberValueObject {
  public constructor(value: number) {
    super(value);
  }
}
