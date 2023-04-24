import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { CommandBus } from '@shared/domain/command-bus';
import { UpdateProductDescriptionCommand } from 'src/contexts/shop/product/application/commands/update-product-description';

export class ProductPutDescriptionController {
  constructor(private commandBus: CommandBus) {}

  async run(req: Request, res: Response) {
    const { id } = req.params;
    const { description } = req.body;

    const command = new UpdateProductDescriptionCommand(id, description);
    await this.commandBus.dispatch(command);

    res.status(httpStatus.CREATED).send();
  }
}