import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { CommandBus } from '@shared/domain/CommandBus';
import { UpdateProductImageCommand } from 'src/contexts/shop/product/application/commands/update-product-image';

export class ProductPutImageController {
  constructor(private commandBus: CommandBus) {}

  async run(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { image } = req.body;

      console.log('📌 ~ req.body:', req.body);
      const command = new UpdateProductImageCommand(id, image);
      await this.commandBus.dispatch(command);

      res.status(httpStatus.CREATED).send();
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
    }
  }
}
