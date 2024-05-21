import {CommandBus} from '@shared/domain/command-bus';
import {created} from '@shop-backend-app/processors/response';
import {Request, Response} from 'express';
import httpStatus from 'http-status';
import {CreateCartCommand} from 'src/contexts/shop/cart/application/commands/create-cart';

export class CartPostController {
    constructor(private readonly commandBus: CommandBus) {}

    async run(req: Request, res: Response): Promise<void> {
        const {id, userId} = req.body;
        const createCommand = new CreateCartCommand(id, userId);
        await this.commandBus.dispatch(createCommand);

        res.status(httpStatus.CREATED).send(created('Successfully created cart'));
    }
}
