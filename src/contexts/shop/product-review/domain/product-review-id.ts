import {Uuid} from '@shared/domain/value-objects/uuid';

export class ProductReviewId extends Uuid {
    public constructor(value: string) {
        super(value);
    }
}
