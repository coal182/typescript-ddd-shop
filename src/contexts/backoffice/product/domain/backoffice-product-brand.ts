import { StringValueObject } from '@shared/domain/value-objects/string-value-object';

import { BackofficeProductNameLengthExceeded } from './backoffice-product-name-length-exceeded';

export class BackofficeProductBrand extends StringValueObject {
  public constructor(value: string) {
    super(value);
    this.ensureLengthIsLessThan50Characters(value || '');
  }

  private ensureLengthIsLessThan50Characters(value: string): void {
    if (value.length > 50) {
      throw new BackofficeProductNameLengthExceeded(
        `The Product Brand <${value}> has more than 50 characters, (it has ${value.length})`
      );
    }
  }
}
