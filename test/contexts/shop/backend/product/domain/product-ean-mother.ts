import { ProductEan } from 'src/contexts/shop/product/domain/product-ean';
import { WordMother } from 'test/contexts/shared/word-mother';

export class ProductEanMother {
  static create(value: string): ProductEan {
    return new ProductEan(value);
  }

  static random(): ProductEan {
    return this.create(WordMother.random());
  }

  static invalidEan(): string {
    return 'a'.repeat(201);
  }
}