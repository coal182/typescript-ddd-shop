import { BackofficeProductPrice } from '@backoffice-backend/product/domain/backoffice-product-price';
import { IntegerMother } from 'tests/contexts/shared/integer-mother';

export class BackofficeProductPriceMother {
  static create(value: number): BackofficeProductPrice {
    return new BackofficeProductPrice(value);
  }

  static random(): BackofficeProductPrice {
    return this.create(IntegerMother.random());
  }
}
