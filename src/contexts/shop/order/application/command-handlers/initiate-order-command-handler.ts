import { inject, injectable } from 'inversify';

import { TYPES } from '@storeback/shared/constants/types';
import { ICommandHandler } from '@core/i-command-handler';
import { InitiateOrderCommand } from 'src/contexts/shop/order/application/commands/initiate-order';
import { IOrderRepository } from 'src/contexts/shop/order/domain/i-order-repository';
import { Order } from 'src/contexts/shop/order/domain/order';
import { OrderAddress } from 'src/contexts/shop/order/domain/order-address';
import { OrderId } from 'src/contexts/shop/order/domain/order-id';
import { OrderName } from 'src/contexts/shop/order/domain/order-name';
import { OrderStatus, OrderStatusEnum } from 'src/contexts/shop/order/domain/order-status';
import { OrderTotal } from 'src/contexts/shop/order/domain/order-total';
import { OrderUser } from 'src/contexts/shop/order/domain/order-user';

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
