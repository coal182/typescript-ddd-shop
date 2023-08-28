import { BackofficeProductName } from '@backoffice-backend/product/domain/backoffice-product-name';
import { WordMother } from 'tests/contexts/shared/word-mother';

export class BackofficeProductNameMother {
  static create(value: string): BackofficeProductName {
    return new BackofficeProductName(value);
  }

  static random(): BackofficeProductName {
    return this.create(WordMother.random());
  }

  static invalidName(): string {
    return 'a'.repeat(201);
  }
}
