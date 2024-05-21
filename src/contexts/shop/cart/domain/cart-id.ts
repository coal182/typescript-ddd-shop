import {Uuid} from '@shared/domain/value-objects/uuid';

export class CartId extends Uuid {
    public constructor(value: string) {
        super(value);
    }
}
