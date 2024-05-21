import {NumberValueObject} from '@shared/domain/value-objects/number-value-object';

export class OrderTotal extends NumberValueObject {
    public constructor(value: number) {
        super(value);
    }
}
