import { ICommandBus } from '@core/i-command-bus';
import { TYPES } from '@storeback/shared/constants/types';
import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpDelete, httpGet, httpPost, request, response } from 'inversify-express-utils';

import { AddLineToOrderCommand } from 'src/contexts/shop/order/application/commands/add-line-to-order';
import { CancelOrderCommand } from 'src/contexts/shop/order/application/commands/cancel-order';
import { CreateOrderCommand } from 'src/contexts/shop/order/application/commands/create-order';
import { InitiateOrderCommand } from 'src/contexts/shop/order/application/commands/initiate-order';
import { OrderStatusEnum } from 'src/contexts/shop/order/domain/order-status';
import { IOrderReadModelFacade } from 'src/contexts/shop/order/infrastructure/projection/orders/read-model';

import { ok } from '../processors/response';

@controller('/api/v1/orders')
export class OrderController {
  constructor(
    @inject(TYPES.CommandBus) private readonly commandBus: ICommandBus,
    @inject(TYPES.OrderReadModelFacade) private readonly readmodel: IOrderReadModelFacade
  ) {}

  @httpPost('')
  async createOrder(@request() req: Request, @response() res: Response) {
    const { guid, userId, name, address, total, lines } = req.body;
    const initiateCommand = new InitiateOrderCommand(guid, userId, name, address, total);
    await this.commandBus.send(initiateCommand);
    let originalVersion = 0;
    for (const line of lines) {
      const lineCommand = new AddLineToOrderCommand(guid, line.bookId, line.qty, line.price, originalVersion);
      await this.commandBus.send(lineCommand);
      originalVersion++;
    }
    const createCommand = new CreateOrderCommand(guid, OrderStatusEnum.Created, originalVersion);
    await this.commandBus.send(createCommand);
    return res.json(ok('Successfully create order request', undefined));
  }

  @httpDelete('/remove/:guid/:bookId/:qty/:price/:originalVersion')
  async CancelOrder(@request() req: Request, @response() res: Response) {
    const command = new CancelOrderCommand(
      req.params.guid,
      OrderStatusEnum.Cancelled,
      Number(req.params.originalVersion)
    );
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
