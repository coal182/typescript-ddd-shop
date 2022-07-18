import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpDelete, httpGet, httpPost, request, response } from 'inversify-express-utils';

import { TYPES } from '@constants/types';
import { ICommandBus } from '@core/i-command-bus';
import { AddLineToOrderCommand } from '@storeback/order/application/commands/add-line-to-order';
import { CancelOrderCommand } from '@storeback/order/application/commands/cancel-order';
import { CreateOrderCommand } from '@storeback/order/application/commands/create-order';
import { OrderStatus } from '@storeback/order/domain/order';
import { IOrderReadModelFacade } from '@storeback/order/infrastructure/projection/orders/read-model';

import { ok } from '../processors/response';

@controller('/api/v1/order')
export class CartController {
  constructor(
    @inject(TYPES.CommandBus) private readonly commandBus: ICommandBus,
    @inject(TYPES.OrderReadModelFacade) private readonly readmodel: IOrderReadModelFacade
  ) {}

  @httpPost('')
  async createCart(@request() req: Request, @response() res: Response) {
    const { guid, userId, status, name, address, total, lines } = req.body;
    const command = new CreateOrderCommand(userId, guid, status, name, address, total);
    await this.commandBus.send(command);
    let originalVersion = 0;
    for (const line of lines) {
      const lineCommand = new AddLineToOrderCommand(guid, line.bookId, line.qty, line.price, originalVersion);
      await this.commandBus.send(lineCommand);
      originalVersion++;
    }
    return res.json(ok('Successfully create order request', undefined));
  }

  @httpDelete('/remove/:guid/:bookId/:qty/:price/:originalVersion')
  async CancelOrder(@request() req: Request, @response() res: Response) {
    const command = new CancelOrderCommand(req.params.guid, OrderStatus.Cancelled, Number(req.params.originalVersion));
    await this.commandBus.send(command);
    return res.json(ok('Successfully removed item to order', undefined));
  }

  @httpGet('/:guid')
  async getById(@request() req: Request, @response() res: Response) {
    const order = await this.readmodel.getById(req.params.guid);
    return res.json(ok('Successfully retrieve the order', order));
  }

  @httpGet('/user/:guid')
  async getByUserId(@request() req: Request, @response() res: Response) {
    const order = await this.readmodel.getByField('userId', req.params.guid);
    return res.json(ok('Successfully retrieve the order', order));
  }
}
