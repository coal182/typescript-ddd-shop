import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { CommandBus } from '@shared/domain/CommandBus';
import { UpdateProductDescriptionCommand } from 'src/contexts/shop/product/application/commands/update-product-description';

export class ProductPutDescriptionController {
  constructor(private commandBus: CommandBus) {}

  async run(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { description } = req.body;

      const command = new UpdateProductDescriptionCommand(id, description);
      await this.commandBus.dispatch(command);

      res.status(httpStatus.CREATED).send();
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
    }
  }
}
