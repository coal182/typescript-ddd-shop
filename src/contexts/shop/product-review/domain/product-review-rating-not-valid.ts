import {InvalidArgumentError} from '@shared/domain/errors/invalid-argument-error';

export class ProductReviewRatingNotValid extends InvalidArgumentError {
    constructor(value: number) {
        super(`The review rating <${value}> is not valid. It must be between 0 and 5`);
    }
}
