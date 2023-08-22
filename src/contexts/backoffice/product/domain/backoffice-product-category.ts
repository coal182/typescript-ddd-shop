import { StringValueObject } from '@shared/domain/value-objects/string-value-object';

import { BackofficeProductNameLengthExceeded } from './backoffice-product-name-length-exceeded';

export class BackofficeProductCategory extends StringValueObject {
  public constructor(value: string) {
    super(value);
    this.ensureLengthIsLessThan100Characters(value || '');
  }

  private ensureLengthIsLessThan100Characters(value: string): void {
    if (value.length > 100) {
      throw new BackofficeProductNameLengthExceeded(
        `The Product Name <${value}> has more than 100 characters, (it has ${value.length})`
      );
    }
  }
}
