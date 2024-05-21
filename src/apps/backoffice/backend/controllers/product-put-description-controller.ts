import {UpdateProductDescriptionCommand} from '@backoffice-backend/product/application/commands/update-product-description';
import {CommandBus} from '@domain/command-bus';
import {Request, Response} from 'express';
import httpStatus from 'http-status';

export class ProductPutDescriptionController {
    constructor(private commandBus: CommandBus) {}

    async run(req: Request, res: Response): Promise<void> {
        const {id} = req.params;
        const {description} = req.body;

        const command = new UpdateProductDescriptionCommand(id, description);
        await this.commandBus.dispatch(command);

        res.status(httpStatus.CREATED).send();
    }
}
