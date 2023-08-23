import { Request, Response } from 'express';

import { CommandBus } from '@shared/domain/command-bus';
import { CancelOrderCommand } from '@shop-backend/order/application/commands/cancel-order';

import { ok } from '../processors/response';

export class OrderDeleteController {
  constructor(private readonly commandBus: CommandBus) {}

  async run(req: Request, res: Response) {
    const { id } = req.params;
    const cancelCommand = new CancelOrderCommand(id);
    await this.commandBus.dispatch(cancelCommand);
    return res.json(ok('Successfully cancel order request', undefined));
  }
}
