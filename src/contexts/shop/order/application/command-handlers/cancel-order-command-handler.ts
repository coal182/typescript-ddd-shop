import { inject, injectable } from 'inversify';

import { TYPES } from '@storeback/shared/constants/types';
import { ICommandHandler } from '@core/i-command-handler';
import { CancelOrderCommand } from 'src/contexts/shop/order/application/commands/cancel-order';
import { IOrderRepository } from 'src/contexts/shop/order/domain/i-order-repository';
import { Order } from 'src/contexts/shop/order/domain/order';

@injectable()
export class CancelOrderCommandHandler implements ICommandHandler<CancelOrderCommand> {
  constructor(@inject(TYPES.OrderRepository) private readonly repository: IOrderRepository) {}
  public static commandToHandle: string = CancelOrderCommandHandler.name;
  async handle(command: CancelOrderCommand) {
    const order: Order = await this.repository.getById(command.guid);
    order.cancel();
    await this.repository.save(order, command.originalVersion);
  }
}
