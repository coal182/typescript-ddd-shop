import { ProductImage } from 'src/contexts/shop/product/domain/product-image';
import { WordMother } from 'test/contexts/shared/word-mother';

export class ProductImageMother {
  static create(value: string): ProductImage {
    return new ProductImage(value);
  }

  static random(): ProductImage {
    return this.create(WordMother.random());
  }
}
