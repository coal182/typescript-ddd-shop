import { BackofficeProductBrand } from '@backoffice-backend/product/domain/backoffice-product-brand';
import { WordMother } from 'tests/contexts/shared/word-mother';

export class BackofficeProductBrandMother {
  static create(value: string): BackofficeProductBrand {
    return new BackofficeProductBrand(value);
  }

  static random(): BackofficeProductBrand {
    return this.create(WordMother.random());
  }

  static invalidBrand(): string {
    return 'a'.repeat(201);
  }
}
