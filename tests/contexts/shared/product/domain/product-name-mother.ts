import { ProductName } from '@shared/product/domain/product-name';
import { WordMother } from 'tests/contexts/shared/word-mother';

export class ProductNameMother {
  static create(value: string): ProductName {
    return new ProductName(value);
  }

  static random(): ProductName {
    return this.create(WordMother.random());
  }

  static invalidName(): string {
    return 'a'.repeat(201);
  }
}
