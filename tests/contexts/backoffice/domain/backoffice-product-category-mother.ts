import { BackofficeProductCategory } from '@backoffice-backend/product/domain/backoffice-product-category';
import { WordMother } from 'tests/contexts/shared/word-mother';

export class BackofficeProductCategoryMother {
  static create(value: string): BackofficeProductCategory {
    return new BackofficeProductCategory(value);
  }

  static random(): BackofficeProductCategory {
    return this.create(WordMother.random());
  }

  static invalidCategory(): string {
    return 'a'.repeat(201);
  }
}
