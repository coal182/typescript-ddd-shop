import { Primitives } from '@domain/value-objects/primitives-type';

import { OrderCity } from './order-city';
import { OrderStreet } from './order-street';

export class OrderAddress {
  constructor(public street: OrderStreet, public city: OrderCity, public number: number) {}

  toPrimitives(): Primitives<OrderAddress> {
    return {
      street: this.street.value,
      city: this.city.value,
      number: this.number,
    };
  }
}
