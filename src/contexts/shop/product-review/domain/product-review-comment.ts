import { StringValueObject } from '@domain/value-objects/string-value-object';

import { ProductReviewCommentTooLong } from './product-review-comment-too-long';

export class ProductReviewComment extends StringValueObject {
  constructor(value: string) {
    super(value);
    this.ensureLengthIsLessThan500Characters();
  }

  private ensureLengthIsLessThan500Characters(): void {
    if (this.value.length > 500) {
      throw new ProductReviewCommentTooLong(this.value);
    }
  }
}
