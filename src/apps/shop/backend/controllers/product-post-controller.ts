import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { Type, array, number, string, type, undefined, union } from 'io-ts';
import { Logger } from 'winston';

import { WrongRequestDataError } from '@domain/errors/wrong-request-data-error';
import { IdProvider } from '@domain/id-provider';
import { ParamsParser } from '@domain/params-parser';
import { CommandBus } from '@shared/domain/command-bus';
import { CreateProductCommand } from 'src/contexts/shop/product/application/commands/create-product';

export type ProductPostRequest = Request & {
  body: CreateProductParams;
};

export type CreateProductParams = {
  id: string | undefined;
  name: string;
  description: string;
  images: string[];
  price: number;
  brand: string;
  category: string;
  ean: string;
};

export class ProductPostController {
  constructor(private commandBus: CommandBus, private logger: Logger) {}

  async run(req: Request<ProductPostRequest>, res: Response) {
    try {
      const { id, name, description, images, price, brand, category, ean } = ParamsParser.parse<CreateProductParams>(
        req.body,
        this.createProductCodec
      );

      const createProductCommand = new CreateProductCommand(
        id ?? IdProvider.getId(),
        name,
        description,
        images,
        price,
        brand,
        category,
        ean
      );
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

  createProductCodec: Type<CreateProductParams> = type({
    id: union([string, undefined]),
    name: string,
    description: string,
    images: array(string),
    price: number,
    brand: string,
    category: string,
    ean: string,
  });
}
