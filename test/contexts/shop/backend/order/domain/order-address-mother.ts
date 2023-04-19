import { OrderAddress } from 'src/contexts/shop/order/domain/order-address';
import { WordMother } from 'test/contexts/shared/word-mother';

export class OrderAddressMother {
  static create(value: string): OrderAddress {
    return new OrderAddress(value);
  }

  static random(): OrderAddress {
    return this.create(WordMother.random());
  }
}
