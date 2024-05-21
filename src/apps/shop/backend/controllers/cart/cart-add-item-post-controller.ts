import {CommandBus} from '@shared/domain/command-bus';
import {AddItemToCartCommand} from '@shop-backend/cart/application/commands/add-item-to-cart';
import {created} from '@shop-backend-app/processors/response';
import {Request, Response} from 'express';
import httpStatus from 'http-status';

export class CartAddItemPostController {
    constructor(private readonly commandBus: CommandBus) {}

    async run(req: Request, res: Response): Promise<void> {
        const {id, productId, qty, price} = req.body;
        const command = new AddItemToCartCommand(id, productId, qty, price);

        await this.commandBus.dispatch(command);
        res.status(httpStatus.CREATED).send(created('Successfully added item to cart'));
    }
}
