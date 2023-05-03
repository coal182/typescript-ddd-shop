import { Request, Response } from 'express';

import { CommandBus } from '@shared/domain/command-bus';
import { RemoveItemFromCartCommand } from '@storeback/cart/application/commands/remove-item-from-cart';

import { ok } from '../processors/response';

export class CartRemoveItemDeleteController {
  constructor(private readonly commandBus: CommandBus) {}

  async run(req: Request, res: Response) {
    const { id, productId, qty, price } = req.params;
    const command = new RemoveItemFromCartCommand(id, productId, Number(qty), Number(price));

    await this.commandBus.dispatch(command);
    return res.json(ok('Successfully removed item from cart', undefined));
  }
}
