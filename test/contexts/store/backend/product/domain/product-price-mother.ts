import { ProductPrice } from '@storeback/product/domain/product-price';
import { IntegerMother } from 'test/contexts/shared/intenger-mother';

export class ProductPriceMother {
  static create(value: number): ProductPrice {
    return new ProductPrice(value);
  }

  static random(): ProductPrice {
    return this.create(IntegerMother.random());
  }
}
