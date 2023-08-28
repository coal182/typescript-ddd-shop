import { BackofficeProductImage } from '@backoffice-backend/product/domain/backoffice-product-image';
import { WordMother } from 'tests/contexts/shared/word-mother';

export class BackofficeProductImageMother {
  static create(value: string): BackofficeProductImage {
    return new BackofficeProductImage(value);
  }

  static random(): BackofficeProductImage {
    return this.create(WordMother.random());
  }
}
