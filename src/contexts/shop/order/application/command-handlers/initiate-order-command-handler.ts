import { Command } from '@shared/domain/command';
import { CommandHandler } from '@shared/domain/command-handler';
import { OrderLine } from '@shop-backend/order/domain/order-line';
import { InitiateOrderCommand } from 'src/contexts/shop/order/application/commands/initiate-order';
import { OrderAddress } from 'src/contexts/shop/order/domain/order-address';
import { OrderId } from 'src/contexts/shop/order/domain/order-id';
import { OrderName } from 'src/contexts/shop/order/domain/order-name';
import { OrderStatus, OrderStatusEnum } from 'src/contexts/shop/order/domain/order-status';
import { OrderTotal } from 'src/contexts/shop/order/domain/order-total';
import { OrderUser } from 'src/contexts/shop/order/domain/order-user';

import { OrderCreator } from '../create/order-creator';

export class InitiateOrderCommandHandler implements CommandHandler<InitiateOrderCommand> {
  constructor(private orderCreator: OrderCreator) {}
  subscribedTo(): Command {
    return InitiateOrderCommand;
  }
  async handle(command: InitiateOrderCommand) {
    const id = new OrderId(command.id);
    const userId = new OrderUser(command.userId);
    const status = new OrderStatus(OrderStatusEnum.Initiated);
    const name = new OrderName(command.name);
    const address = new OrderAddress(command.address);
    const total = new OrderTotal(command.total);
    const lines: Array<OrderLine> = [];
    await this.orderCreator.run({ id, userId, status, name, address, total, lines });
  }
}
