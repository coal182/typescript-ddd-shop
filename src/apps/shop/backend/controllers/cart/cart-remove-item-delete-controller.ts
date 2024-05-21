import {CommandBus} from '@shared/domain/command-bus';
import {RemoveItemFromCartCommand} from '@shop-backend/cart/application/commands/remove-item-from-cart';
import {ok} from '@shop-backend-app/processors/response';
import {Request, Response} from 'express';
import httpStatus from 'http-status';

export class CartRemoveItemDeleteController {
    constructor(private readonly commandBus: CommandBus) {}

    async run(req: Request, res: Response): Promise<void> {
        const {id, productId, qty, price} = req.params;
        const command = new RemoveItemFromCartCommand(id, productId, Number(qty), Number(price));

        await this.commandBus.dispatch(command);

        res.status(httpStatus.OK).send(ok('Successfully removed item from cart'));
    }
}
