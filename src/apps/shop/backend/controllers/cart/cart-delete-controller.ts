import {CommandBus} from '@shared/domain/command-bus';
import {ClearCartCommand} from '@shop-backend/cart/application/commands/clear-cart';
import {ok} from '@shop-backend-app/processors/response';
import {Request, Response} from 'express';
import httpStatus from 'http-status';

export class CartDeleteController {
    constructor(private readonly commandBus: CommandBus) {}

    async run(req: Request, res: Response): Promise<void> {
        const {id} = req.params;
        const command = new ClearCartCommand(id);

        await this.commandBus.dispatch(command);
        res.status(httpStatus.OK).send(ok('Successfully cleared cart'));
    }
}
