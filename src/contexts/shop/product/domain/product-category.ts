import { StringValueObject } from '@shared/domain/value-objects/string-value-object';

import { ProductNameLengthExceeded } from './product-name-length-exceeded';

export class ProductCategory extends StringValueObject {
  public constructor(value: string) {
    super(value);
    this.ensureLengthIsLessThan100Characters(value || '');
  }

  private ensureLengthIsLessThan100Characters(value: string): void {
    if (value.length > 100) {
      throw new ProductNameLengthExceeded(
        `The Product Name <${value}> has more than 100 characters, (it has ${value.length})`
      );
    }
  }
}
