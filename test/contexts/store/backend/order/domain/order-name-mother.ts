import { OrderName } from '@storeback/order/domain/order-name';
import { WordMother } from 'test/contexts/shared/word-mother';

export class OrderNameMother {
  static create(value: string): OrderName {
    return new OrderName(value);
  }

  static random(): OrderName {
    return this.create(WordMother.random());
  }
}
