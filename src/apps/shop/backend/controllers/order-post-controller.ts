import { Request, Response } from 'express';

import { CommandBus } from '@shared/domain/command-bus';
import { AddLineToOrderCommand } from 'src/contexts/shop/order/application/commands/add-line-to-order';
import { CreateOrderCommand } from 'src/contexts/shop/order/application/commands/create-order';
import { InitiateOrderCommand } from 'src/contexts/shop/order/application/commands/initiate-order';

import { ok } from '../processors/response';

export class OrderPostController {
  constructor(private readonly commandBus: CommandBus) {}

  async run(req: Request, res: Response) {
    const { id, userId, name, address, total, lines } = req.body;
    const initiateCommand = new InitiateOrderCommand(id, userId, name, address, total);
    await this.commandBus.dispatch(initiateCommand);
    for (const line of lines) {
      const lineCommand = new AddLineToOrderCommand(id, line.productId, line.qty, line.price);
      await this.commandBus.dispatch(lineCommand);
    }
    const createCommand = new CreateOrderCommand(id);
    await this.commandBus.dispatch(createCommand);
    return res.json(ok('Successfully create order request', undefined));
  }
}
