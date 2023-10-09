import { ProductBrand } from '@shared/product/domain/product-brand';
import { WordMother } from 'tests/contexts/shared/word-mother';

export class ProductBrandMother {
  static create(value: string): ProductBrand {
    return new ProductBrand(value);
  }

  static random(): ProductBrand {
    return this.create(WordMother.random());
  }

  static invalidBrand(): string {
    return 'a'.repeat(201);
  }
}
