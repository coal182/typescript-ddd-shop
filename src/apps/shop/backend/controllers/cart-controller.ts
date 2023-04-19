import { ICommandBus } from '@core/i-command-bus';
import { TYPES } from '@storeback/shared/constants/types';
import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpDelete, httpGet, httpPost, request, response } from 'inversify-express-utils';

import { AddItemToCartCommand } from 'src/contexts/shop/cart/application/commands/add-item-to-cart';
import { ClearCartCommand } from 'src/contexts/shop/cart/application/commands/clear-cart';
import { CreateCartCommand } from 'src/contexts/shop/cart/application/commands/create-cart';
import { RemoveItemFromCartCommand } from 'src/contexts/shop/cart/application/commands/remove-item-from-cart';
import { ICartReadModelFacade } from 'src/contexts/shop/cart/infrastructure/projection/carts/read-model';

import { ok } from '../processors/response';

@controller('/api/v1/cart')
export class CartController {
  constructor(
    @inject(TYPES.CommandBus) private readonly commandBus: ICommandBus,
    @inject(TYPES.CartReadModelFacade) private readonly readmodel: ICartReadModelFacade
  ) {}

  @httpPost('')
  async createCart(@request() req: Request, @response() res: Response) {
    const { guid, userId } = req.body;
    const command = new CreateCartCommand(userId, guid);
    await this.commandBus.send(command);
    return res.json(ok('Successfully create cart request', undefined));
  }

  @httpPost('/add')
  async addItemToCart(@request() req: Request, @response() res: Response) {
    const { guid, bookId, qty, price, originalVersion } = req.body;
    const command = new AddItemToCartCommand(guid, bookId, qty, price, originalVersion);
    await this.commandBus.send(command);
    return res.json(ok('Successfully added item to cart', undefined));
  }

  @httpDelete('/remove/:guid/:bookId/:qty/:price/:originalVersion')
  async removeItemFromCart(@request() req: Request, @response() res: Response) {
    const command = new RemoveItemFromCartCommand(
      req.params.guid,
      req.params.bookId,
      Number(req.params.qty),
      Number(req.params.price),
      Number(req.params.originalVersion)
    );
    await this.commandBus.send(command);
    return res.json(ok('Successfully removed item to cart', undefined));
  }

  @httpDelete('/clear/:guid/:originalVersion')
  async clearCart(@request() req: Request, @response() res: Response) {
    const command = new ClearCartCommand(req.params.guid, Number(req.params.originalVersion));
    await this.commandBus.send(command);
    return res.json(ok('Successfully cleared cart', undefined));
  }

  @httpGet('/:guid')
  async getById(@request() req: Request, @response() res: Response) {
    const cart = await this.readmodel.getById(req.params.guid);
    return res.json(ok('Successfully retrieve the cart', cart));
  }

  @httpGet('/user/:guid')
  async getByUserId(@request() req: Request, @response() res: Response) {
    const cart = await this.readmodel.getByField('userId', req.params.guid);
    return res.json(ok('Successfully retrieve the cart', cart));
  }
}
