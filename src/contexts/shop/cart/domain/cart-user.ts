import {Uuid} from '@shared/domain/value-objects/uuid';

export class CartUser extends Uuid {
    public constructor(value: string) {
        super(value);
    }
}
