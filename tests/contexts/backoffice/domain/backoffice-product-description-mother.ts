import { BackofficeProductDescription } from '@backoffice-backend/product/domain/backoffice-product-description';
import { WordMother } from 'tests/contexts/shared/word-mother';

export class BackofficeProductDescriptionMother {
  static create(value: string): BackofficeProductDescription {
    return new BackofficeProductDescription(value);
  }

  static random(): BackofficeProductDescription {
    return this.create(WordMother.random());
  }
}
