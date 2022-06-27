import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpDelete, httpGet, httpPost, request, response } from 'inversify-express-utils';

import { ICartReadModelFacade } from '@application/projection/cart/ReadModel';
import { AddItemToCartCommand } from '@commands/cart/AddItemToCart';
import { CreateCartCommand } from '@commands/cart/CreateCart';
import { RemoveItemFromCartCommand } from '@commands/cart/RemoveItemFromCart';
import { TYPES } from '@constants/types';
import { ICommandBus } from '@core/ICommandBus';

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
  async RemoveItemFromCart(@request() req: Request, @response() res: Response) {
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
