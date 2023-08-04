import { OrderTotal } from 'src/contexts/shop/order/domain/order-total';
import { IntegerMother } from 'tests/contexts/shared/intenger-mother';

export class OrderTotalMother {
  static create(value: number): OrderTotal {
    return new OrderTotal(value);
  }

  static random(): OrderTotal {
    return this.create(IntegerMother.random());
  }
}
