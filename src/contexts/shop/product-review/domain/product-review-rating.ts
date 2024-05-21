import {NumberValueObject} from '@shared/domain/value-objects/number-value-object';

import {ProductReviewRatingNotValid} from './product-review-rating-not-valid';

export class ProductReviewRating extends NumberValueObject {
    public constructor(value: number) {
        super(value);
        this.ensureIsBetween0and5();
    }

    private ensureIsBetween0and5(): void {
        if (this.value < 0 || this.value > 5) {
            throw new ProductReviewRatingNotValid(this.value);
        }
    }
}
