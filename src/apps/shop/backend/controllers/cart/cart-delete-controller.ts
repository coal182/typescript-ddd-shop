import { Request, Response } from 'express';

import { CommandBus } from '@shared/domain/command-bus';
import { ClearCartCommand } from '@shop-backend/cart/application/commands/clear-cart';

import { ok } from '../../processors/response';

export class CartDeleteController {
  constructor(private readonly commandBus: CommandBus) {}

  async run(req: Request, res: Response) {
    const { id } = req.params;
    const command = new ClearCartCommand(id);

    await this.commandBus.dispatch(command);
    return res.json(ok('Successfully cleared cart', undefined));
  }
}
