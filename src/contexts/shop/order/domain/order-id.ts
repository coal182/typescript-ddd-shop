import {Uuid} from '@shared/domain/value-objects/uuid';

export class OrderId extends Uuid {
    public constructor(value: string) {
        super(value);
    }
}
