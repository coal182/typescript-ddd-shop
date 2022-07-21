import { AggregateRoot } from '@core/aggregate-root';

import { OrderCancelled } from './events/order-cancelled';
import { OrderCreated } from './events/order-created';
import { OrderInitiated } from './events/order-initiated';
import { OrderLineAdded } from './events/order-line-added';
import { OrderAddress } from './order-address';
import { OrderId } from './order-id';
import { OrderLine } from './order-line';
import { OrderName } from './order-name';
import { OrderStatus, OrderStatusEnum } from './order-status';
import { OrderTotal } from './order-total';
import { OrderUser } from './order-user';
export class Order extends AggregateRoot {
  public guid: OrderId;
  public userId: OrderUser;
  public status: OrderStatus;
  public name: OrderName;
  public address: OrderAddress;
  public total: OrderTotal;
  public lines: Array<OrderLine>;

  constructor();

  constructor(
    guid: OrderId,
    userId: OrderUser,
    status: OrderStatus,
    name: OrderName,
    address: OrderAddress,
    total: OrderTotal,
    lines: Array<OrderLine>
  );

  constructor(
    guid?: OrderId,
    userId?: OrderUser,
    status?: OrderStatus,
    name?: OrderName,
    address?: OrderAddress,
    total?: OrderTotal,
    lines?: Array<OrderLine>
  ) {
    super();
    if (guid && userId && status && name && address && total) {
      this.applyChange(
        new OrderInitiated(guid.value, userId.value, status.value, name.value, address.value, total.value)
      );
    }
  }

  public addLine(line: OrderLine) {
    this.applyChange(new OrderLineAdded(this.guid.value, line));
  }

  public create() {
    this.applyChange(new OrderCreated(this.guid.value));
  }

  public cancel() {
    this.status = new OrderStatus(OrderStatusEnum.Cancelled);
    this.applyChange(new OrderCancelled(this.guid.value, OrderStatusEnum.Cancelled));
  }

  applyOrderInitiated(event: OrderInitiated) {
    this.guid = new OrderId(event.guid);
    this.userId = new OrderUser(event.userId);
    this.status = new OrderStatus(OrderStatusEnum.Initiated);
    this.name = new OrderName(event.name);
    this.address = new OrderAddress(event.address);
    this.total = new OrderTotal(event.total);
    this.lines = [];
  }

  applyOrderCreated(event: OrderCreated) {
    this.guid = new OrderId(event.guid);
    this.status = new OrderStatus(OrderStatusEnum.Created);
  }

  applyOrderCanceled(event: OrderCancelled) {
    this.guid = new OrderId(event.guid);
    this.status = new OrderStatus(event.status);
  }

  applyOrderLineAdded(event: OrderLineAdded) {
    this.lines.push(event.line);
  }
}
