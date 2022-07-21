import { OrderStatus } from '@storeback/order/domain/order-status';
import { WordMother } from 'test/contexts/shared/word-mother';

export class OrderStatusMother {
  static create(value: string): OrderStatus {
    return new OrderStatus(value);
  }

  static random(): OrderStatus {
    return this.create('created');
  }
}
