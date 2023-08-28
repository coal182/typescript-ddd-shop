import { BackofficeProductEan } from '@backoffice-backend/product/domain/backoffice-product-ean';
import { WordMother } from 'tests/contexts/shared/word-mother';

export class BackofficeProductEanMother {
  static create(value: string): BackofficeProductEan {
    return new BackofficeProductEan(value);
  }

  static random(): BackofficeProductEan {
    return this.create(WordMother.random());
  }

  static invalidEan(): string {
    return 'a'.repeat(201);
  }
}
