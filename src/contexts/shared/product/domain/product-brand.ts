import {StringValueObject} from '@shared/domain/value-objects/string-value-object';

import {ProductNameLengthExceeded} from './product-name-length-exceeded';

export class ProductBrand extends StringValueObject {
    public constructor(value: string) {
        super(value);
        this.ensureLengthIsLessThan50Characters(value || '');
    }

    private ensureLengthIsLessThan50Characters(value: string): void {
        if (value.length > 50) {
            throw new ProductNameLengthExceeded(`The Product Brand <${value}> has more than 50 characters, (it has ${value.length})`);
        }
    }
}
