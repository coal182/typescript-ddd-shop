import { ProductsCounterTotal } from '@storeback/products-counter/domain/products-counter-total';
import { IntegerMother } from 'tests/contexts/shared/integer-mother';

export class ProductsCounterTotalMother {
  static random() {
    return new ProductsCounterTotal(IntegerMother.random());
  }
}
