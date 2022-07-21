import { inject, injectable } from 'inversify';

import { TYPES } from '@constants/types';
import { ICommandHandler } from '@core/i-command-handler';
import { InitiateOrderCommand } from '@storeback/order/application/commands/initiate-order';
import { IOrderRepository } from '@storeback/order/domain/i-order-repository';
import { Order } from '@storeback/order/domain/order';
import { OrderAddress } from '@storeback/order/domain/order-address';
import { OrderId } from '@storeback/order/domain/order-id';
import { OrderName } from '@storeback/order/domain/order-name';
import { OrderStatus, OrderStatusEnum } from '@storeback/order/domain/order-status';
import { OrderTotal } from '@storeback/order/domain/order-total';
import { OrderUser } from '@storeback/order/domain/order-user';

@injectable()
export class InitiateOrderCommandHandler implements ICommandHandler<InitiateOrderCommand> {
  constructor(@inject(TYPES.OrderRepository) private readonly repository: IOrderRepository) {}
  public static commandToHandle: string = InitiateOrderCommand.name;
  async handle(command: InitiateOrderCommand) {
    const order: Order = new Order(
      new OrderId(command.guid),
      new OrderUser(command.userId),
      new OrderStatus(OrderStatusEnum.Initiated),
      new OrderName(command.name),
      new OrderAddress(command.address),
      new OrderTotal(command.total),
      []
    );
    await this.repository.save(order, -1);
  }
}
