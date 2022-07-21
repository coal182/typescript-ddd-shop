import { OrderId } from '@storeback/order/domain/order-id';
import { UuidMother } from 'test/contexts/shared/uuid-mother';

export class OrderIdMother {
  static create(value: string): OrderId {
    return new OrderId(value);
  }

  static creator() {
    return () => OrderIdMother.random();
  }

  static random(): OrderId {
    return this.create(UuidMother.random());
  }
}
