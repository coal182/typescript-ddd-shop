import { StringValueObject } from '@shared/domain/value-objects/string-value-object';

import { BackofficeProductNameLengthExceeded } from './backoffice-product-name-length-exceeded';

export class BackofficeProductEan extends StringValueObject {
  public constructor(value: string) {
    super(value);
    this.ensureLengthIsLessThan200Characters(value || '');
  }

  private ensureLengthIsLessThan200Characters(value: string): void {
    if (value.length > 200) {
      throw new BackofficeProductNameLengthExceeded(
        `The Product Name <${value}> has more than 200 characters, (it has ${value.length})`
      );
    }
  }
}
