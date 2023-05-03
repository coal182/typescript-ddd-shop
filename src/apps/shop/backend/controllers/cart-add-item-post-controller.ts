import { Request, Response } from 'express';

import { CommandBus } from '@shared/domain/command-bus';
import { AddItemToCartCommand } from '@storeback/cart/application/commands/add-item-to-cart';

import { ok } from '../processors/response';

export class CartAddItemPostController {
  constructor(private readonly commandBus: CommandBus) {}

  async run(req: Request, res: Response) {
    const { id, productId, qty, price } = req.body;
    const command = new AddItemToCartCommand(id, productId, qty, price);

    await this.commandBus.dispatch(command);
    return res.json(ok('Successfully added item to cart', undefined));
  }
}
