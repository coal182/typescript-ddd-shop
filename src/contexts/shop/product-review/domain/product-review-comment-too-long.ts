import {InvalidArgumentError} from '@shared/domain/errors/invalid-argument-error';

export class ProductReviewCommentTooLong extends InvalidArgumentError {
    constructor(value: string) {
        super(`The review comment <${value}> is too long. Max 500 chars`);
    }
}
