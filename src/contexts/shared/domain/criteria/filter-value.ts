import {StringValueObject} from '../value-objects/string-value-object';

export class FilterValue extends StringValueObject {
    constructor(value: string) {
        super(value);
    }
}
