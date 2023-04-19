import { ProductName } from 'src/contexts/shop/product/domain/product-name';
import { WordMother } from 'test/contexts/shared/word-mother';

export class ProductNameMother {
  static create(value: string): ProductName {
    return new ProductName(value);
  }

  static random(): ProductName {
    return this.create(WordMother.random());
  }
}
