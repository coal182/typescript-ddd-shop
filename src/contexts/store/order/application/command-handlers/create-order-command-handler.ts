import { inject, injectable } from 'inversify';

import { TYPES } from '@storeback/shared/constants/types';
import { ICommandHandler } from '@core/i-command-handler';
import { CreateOrderCommand } from '@storeback/order/application/commands/create-order';
import { IOrderRepository } from '@storeback/order/domain/i-order-repository';
import { Order } from '@storeback/order/domain/order';

@injectable()
export class CreateOrderCommandHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(@inject(TYPES.OrderRepository) private readonly repository: IOrderRepository) {}
  public static commandToHandle: string = CreateOrderCommand.name;
  async handle(command: CreateOrderCommand) {
    const order: Order = await this.repository.getById(command.guid);
    order.create();
    await this.repository.save(order, command.originalVersion);
  }
}
