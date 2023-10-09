import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { WrongRequestDataError } from '@domain/errors/wrong-request-data-error';
import { ParamsParser } from '@domain/params-parser';
import { Primitives } from '@domain/value-objects/primitives-type';
import WinstonLogger from '@infrastructure/winston-logger';
import { CommandBus } from '@shared/domain/command-bus';
import {
  CreateProductCommand,
  createProductCodec,
} from 'src/contexts/backoffice/product/application/commands/create-product';

export class ProductPostController {
  constructor(private commandBus: CommandBus, private logger: WinstonLogger) {}

  async run(req: Request, res: Response) {
    try {
      const { id, name, description, images, price, brand, category, ean } = ParamsParser.parse<
        Primitives<CreateProductCommand>
      >(req.body, createProductCodec);

      const createProductCommand = new CreateProductCommand(id, name, description, images, price, brand, category, ean);
      await this.commandBus.dispatch(createProductCommand);
      res.status(httpStatus.CREATED).send();
    } catch (error) {
      if (error instanceof WrongRequestDataError) {
        this.logger.error(error.message);
        res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error interno del servidor' });
      }
    }
  }
}
