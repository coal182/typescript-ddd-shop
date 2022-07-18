import { AggregateRoot } from '@core/aggregate-root';

import { OrderCancelled } from './events/order-cancelled';
import { OrderCreated } from './events/order-created';
import { OrderLineAdded } from './events/order-line-added';
import { OrderLine } from './order-line';

export enum OrderStatus {
  Created = 'created',
  Cancelled = 'cancelled',
}

export class Order extends AggregateRoot {
  public userId: string;
  private status: OrderStatus;
  private name: string;
  private address: string;
  private total: number;
  private lines: Array<OrderLine>;

  constructor();

  constructor(guid: string, userId: string, status: OrderStatus, name: string, address: string, total: number);

  constructor(guid?: string, userId?: string, status?: OrderStatus, name?: string, address?: string, total?: number) {
    super();
    if (guid && userId && status && name && address && total) {
      this.applyChange(new OrderCreated(guid, userId, status, name, address, total));
    }
  }

  public addLine(line: OrderLine) {
    this.applyChange(new OrderLineAdded(this.guid, line));
  }

  public cancel() {
    this.status = OrderStatus.Cancelled;
    this.applyChange(new OrderCancelled(this.guid, this.status));
  }

  applyOrderCreated(event: OrderCreated) {
    this.guid = event.guid;
    this.userId = event.userId;
    this.status = event.status;
    this.name = event.name;
    this.address = event.address;
    this.total = event.total;
    this.lines = [];
  }

  applyOrderCanceled(event: OrderCancelled) {
    this.guid = event.guid;
    this.status = event.status;
  }

  public applyOrderLineAdded(event: OrderLineAdded) {
    this.lines.push(event.line);
  }
}
