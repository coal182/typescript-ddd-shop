import {UpdateProductImageCommand} from '@backoffice-backend/product/application/commands/update-product-image';
import {CommandBus} from '@domain/command-bus';
import {Request, Response} from 'express';
import httpStatus from 'http-status';

export class ProductPutImageController {
    constructor(private commandBus: CommandBus) {}

    async run(req: Request, res: Response): Promise<void> {
        const {id} = req.params;
        const {images} = req.body;

        const command = new UpdateProductImageCommand(id, images);
        await this.commandBus.dispatch(command);

        res.status(httpStatus.CREATED).send();
    }
}
