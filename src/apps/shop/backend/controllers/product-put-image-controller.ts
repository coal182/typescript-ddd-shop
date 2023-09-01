import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { CommandBus } from '@shared/domain/command-bus';
import { UpdateProductImageCommand } from 'src/contexts/shop/product/application/commands/update-product-image';

export class ProductPutImageController {
  constructor(private commandBus: CommandBus) {}

  async run(req: Request, res: Response) {
    const { id } = req.params;
    const { images } = req.body;

    const command = new UpdateProductImageCommand(id, images);
    await this.commandBus.dispatch(command);

    res.status(httpStatus.CREATED).send();
  }
}
