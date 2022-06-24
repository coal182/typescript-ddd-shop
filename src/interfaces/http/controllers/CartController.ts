import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';

import { ICartReadModelFacade } from '@application/projection/cart/ReadModel';
import { CreateCartCommand } from '@commands/cart/CreateCart';
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

  @httpGet('/:guid')
  async getById(@request() req: Request, @response() res: Response) {
    const cart = await this.readmodel.getById(req.params.guid);
    return res.json(ok('Successfully retrieve the cart', cart));
  }

  @httpGet('/user/:guid')
  async getByUserId(@request() req: Request, @response() res: Response) {
    const cart = await this.readmodel.getById(req.params.guid);
    return res.json(ok('Successfully retrieve the cart', cart));
  }
}
