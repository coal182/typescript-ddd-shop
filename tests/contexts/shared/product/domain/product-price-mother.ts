import { ProductPrice } from '@shared/product/domain/product-price';
import { IntegerMother } from 'tests/contexts/shared/integer-mother';

export class ProductPriceMother {
  static create(value: number): ProductPrice {
    return new ProductPrice(value);
  }

  static random(): ProductPrice {
    return this.create(IntegerMother.random());
  }
}
