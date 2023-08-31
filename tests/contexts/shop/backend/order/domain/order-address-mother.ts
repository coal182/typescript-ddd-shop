import { OrderCity } from '@shop-backend/order/domain/order-city';
import { OrderStreet } from '@shop-backend/order/domain/order-street';
import { OrderAddress } from 'src/contexts/shop/order/domain/order-address';
import { IntegerMother } from 'tests/contexts/shared/integer-mother';
import { WordMother } from 'tests/contexts/shared/word-mother';

export class OrderAddressMother {
  static create(street: string, city: string, number: number): OrderAddress {
    return new OrderAddress(new OrderStreet(street), new OrderCity(city), number);
  }

  static random(): OrderAddress {
    return this.create(WordMother.random(), WordMother.random(), IntegerMother.random());
  }
}
