import { OrderTotal } from '@storeback/order/domain/order-total';
import { IntegerMother } from 'test/contexts/shared/intenger-mother';

export class OrderTotalMother {
  static create(value: number): OrderTotal {
    return new OrderTotal(value);
  }

  static random(): OrderTotal {
    return this.create(IntegerMother.random());
  }
}
