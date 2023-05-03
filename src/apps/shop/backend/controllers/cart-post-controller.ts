import { Request, Response } from 'express';

import { CommandBus } from '@shared/domain/command-bus';
import { CreateCartCommand } from 'src/contexts/shop/cart/application/commands/create-cart';

import { ok } from '../processors/response';

export class CartPostController {
  constructor(private readonly commandBus: CommandBus) {}

  async run(req: Request, res: Response) {
    const { id, userId } = req.body;
    const createCommand = new CreateCartCommand(id, userId);
    await this.commandBus.dispatch(createCommand);
    return res.json(ok('Successfully create cart request', undefined));
  }
}
