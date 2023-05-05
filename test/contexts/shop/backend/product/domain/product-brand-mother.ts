import { ProductBrand } from 'src/contexts/shop/product/domain/product-brand';
import { WordMother } from 'test/contexts/shared/word-mother';

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
