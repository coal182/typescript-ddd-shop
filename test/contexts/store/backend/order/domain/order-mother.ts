import { Order } from '@storeback/order/domain/order';
import { OrderAddress } from '@storeback/order/domain/order-address';
import { OrderId } from '@storeback/order/domain/order-id';
import { OrderLine } from '@storeback/order/domain/order-line';
import { OrderName } from '@storeback/order/domain/order-name';
import { OrderStatus } from '@storeback/order/domain/order-status';
import { OrderTotal } from '@storeback/order/domain/order-total';
import { OrderUser } from '@storeback/order/domain/order-user';

import { OrderAddressMother } from './order-address-mother';
import { OrderIdMother } from './order-id-mother';
import { OrderNameMother } from './order-name-mother';
import { OrderStatusMother } from './order-status-mother';
import { OrderTotalMother } from './order-total-mother';
import { OrderUserMother } from './order-user-mother';

export class OrderMother {
  static create(
    guid: OrderId,
    userId: OrderUser,
    status: OrderStatus,
    name: OrderName,
    address: OrderAddress,
    total: OrderTotal,
    lines: Array<OrderLine>
  ): Order {
    return new Order(guid, userId, status, name, address, total, lines);
  }

  static random(): Order {
    return this.create(
      OrderIdMother.random(),
      OrderUserMother.random(),
      OrderStatusMother.random(),
      OrderNameMother.random(),
      OrderAddressMother.random(),
      OrderTotalMother.random(),
      []
    );
  }
}
