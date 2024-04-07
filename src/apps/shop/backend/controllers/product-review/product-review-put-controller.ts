import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { InvalidArgumentError } from '@domain/errors/invalid-argument-error';
import { WrongRequestDataError } from '@domain/errors/wrong-request-data-error';
import { ParamsParser } from '@domain/params-parser';
import { Primitives } from '@domain/value-objects/primitives-type';
import WinstonLogger from '@infrastructure/winston-logger';
import { CommandBus } from '@shared/domain/command-bus';
import { ProductNotFound } from '@shop-backend/product/domain/product-not-found';
import {
  UpdateProductReviewCommand,
  updateProductReviewCodec,
} from '@shop-backend/product-review/application/commands/update-product-review';

export class ProductReviewPutController {
  constructor(private commandBus: CommandBus, private logger: WinstonLogger) {}

  async run(req: Request, res: Response) {
    try {
      const { id, productId, userId, rating, comment } = ParamsParser.parse<Primitives<UpdateProductReviewCommand>>(
        req.body,
        updateProductReviewCodec
      );

      const updateProductReviewCommand = new UpdateProductReviewCommand(id, productId, userId, rating, comment);
      await this.commandBus.dispatch(updateProductReviewCommand);
      res.status(httpStatus.OK).send();
    } catch (error) {
      if (error instanceof WrongRequestDataError) {
        this.logger.error(error.message);
        res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
      } else if (error instanceof ProductNotFound) {
        this.logger.error(error.message);
        res.status(httpStatus.NOT_FOUND).json({ message: error.message });
      } else if (error instanceof InvalidArgumentError) {
        this.logger.error(error);
        res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
      } else if (error instanceof Error) {
        this.logger.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
      } else {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'An unhandled error has occurred' });
      }
    }
  }
}
