import { inject, injectable } from 'inversify';

import { TYPES } from '@storeback/shared/constants/types';
import { ICommandHandler } from '@core/i-command-handler';
import { AddLineToOrderCommand } from '@storeback/order/application/commands/add-line-to-order';
import { IOrderRepository } from '@storeback/order/domain/i-order-repository';
import { Order } from '@storeback/order/domain/order';
import { OrderLine } from '@storeback/order/domain/order-line';

@injectable()
export class AddLineToOrderCommandHandler implements ICommandHandler<AddLineToOrderCommand> {
  constructor(@inject(TYPES.OrderRepository) private readonly repository: IOrderRepository) {}
  public static commandToHandle: string = AddLineToOrderCommand.name;
  async handle(command: AddLineToOrderCommand) {
    const order: Order = await this.repository.getById(command.guid);
    const line = new OrderLine(command.bookId, command.qty, command.price);
    order.addLine(line);
    await this.repository.save(order, command.originalVersion);
  }
}
