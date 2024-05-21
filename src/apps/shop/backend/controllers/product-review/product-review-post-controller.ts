import {WrongRequestDataError} from '@domain/errors/wrong-request-data-error';
import {ParamsParser} from '@domain/params-parser';
import {Primitives} from '@domain/value-objects/primitives-type';
import WinstonLogger from '@infrastructure/winston-logger';
import {CommandBus} from '@shared/domain/command-bus';
import {ProductNotFound} from '@shop-backend/product/domain/product-not-found';
import {Request, Response} from 'express';
import httpStatus from 'http-status';
import {CreateProductReviewCommand, createProductReviewCodec} from 'src/contexts/shop/product-review/application/commands/create-product-review';

export class ProductReviewPostController {
    constructor(
        private commandBus: CommandBus,
        private logger: WinstonLogger,
    ) {}

    async run(req: Request, res: Response): Promise<void> {
        try {
            const {id, productId, userId, rating, comment} = ParamsParser.parse<Primitives<CreateProductReviewCommand>>(req.body, createProductReviewCodec);

            const createProductReviewCommand = new CreateProductReviewCommand(id, productId, userId, rating, comment);
            await this.commandBus.dispatch(createProductReviewCommand);
            res.status(httpStatus.CREATED).send();
        } catch (error) {
            if (error instanceof WrongRequestDataError) {
                this.logger.error(error.message);
                res.status(httpStatus.BAD_REQUEST).json({message: error.message});
            } else if (error instanceof ProductNotFound) {
                this.logger.error(error.message);
                res.status(httpStatus.NOT_FOUND).json({message: error.message});
            } else {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error interno del servidor'});
            }
        }
    }
}
