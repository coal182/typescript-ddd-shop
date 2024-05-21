import {CommandBus} from '@shared/domain/command-bus';
import {ok} from '@shop-backend-app/processors/response';
import {Request, Response} from 'express';
import httpStatus from 'http-status';
import {AddLineToOrderCommand} from 'src/contexts/shop/order/application/commands/add-line-to-order';
import {CreateOrderCommand} from 'src/contexts/shop/order/application/commands/create-order';
import {InitiateOrderCommand} from 'src/contexts/shop/order/application/commands/initiate-order';

export class OrderPostController {
    constructor(private readonly commandBus: CommandBus) {}

    async run(req: Request, res: Response): Promise<void> {
        const {id, userId, name, address, total, lines} = req.body;
        const initiateCommand = new InitiateOrderCommand(id, userId, name, address, total);
        await this.commandBus.dispatch(initiateCommand);
        for (const line of lines) {
            const lineCommand = new AddLineToOrderCommand(id, line.productId, line.qty, line.price);
            await this.commandBus.dispatch(lineCommand);
        }
        const createCommand = new CreateOrderCommand(id);
        await this.commandBus.dispatch(createCommand);

        res.status(httpStatus.CREATED).send(ok('Successfully created order request'));
    }
}
