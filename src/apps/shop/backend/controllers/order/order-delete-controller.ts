import {CommandBus} from '@shared/domain/command-bus';
import {CancelOrderCommand} from '@shop-backend/order/application/commands/cancel-order';
import {ok} from '@shop-backend-app/processors/response';
import {Request, Response} from 'express';
import httpStatus from 'http-status';

export class OrderDeleteController {
    constructor(private readonly commandBus: CommandBus) {}

    async run(req: Request, res: Response): Promise<void> {
        const {id} = req.params;
        const cancelCommand = new CancelOrderCommand(id);
        await this.commandBus.dispatch(cancelCommand);
        res.status(httpStatus.OK).send(ok('Successfully cancelled order request'));
    }
}
