import { ProductDescription } from '@storeback/product/domain/product-description';
import { WordMother } from 'test/contexts/shared/word-mother';

export class ProductDescriptionMother {
  static create(value: string): ProductDescription {
    return new ProductDescription(value);
  }

  static random(): ProductDescription {
    return this.create(WordMother.random());
  }
}
