import { compareSync } from 'bcryptjs';
import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpPost, request, response } from 'inversify-express-utils';
import { v4 as uuidv4 } from 'uuid';

import { TYPES } from '@constants/types';
import { NotFoundException, PasswordNotMatchException } from '@core/application-error';
import { CommandBus } from '@infrastructure/command-bus';
import { CreateCartCommand } from '@storeback/cart/application/commands/create-cart';
import { CartDTO } from '@storeback/cart/infrastructure/projection/carts/read-model';
import { IUserReadModelFacade } from '@storeback/user/infrastructure/projection/users/read-model';

import { createJWToken } from '../middlewares/auth';
import { ok } from '../processors/response';

@controller('/api/v1/login')
export class LoginController {
  constructor(
    @inject(TYPES.CommandBus) private readonly commandBus: CommandBus,
    @inject(TYPES.UserReadModelFacade) private readonly userReadModel: IUserReadModelFacade,
    @inject(TYPES.CartReadModelFacade) private readonly cartReadModel: IUserReadModelFacade
  ) {}

  @httpPost('/signin')
  async login(@request() req: Request, @response() res: Response) {
    const { email, password } = req.body;

    const user = await this.userReadModel.getByField('email', email);

    if (!user) {
      throw new PasswordNotMatchException('Email or password is incorrect');
    }

    if (!compareSync(password, user.password)) {
      throw new PasswordNotMatchException('Email or password is incorrect');
    }

    let cart: CartDTO;

    try {
      cart = await this.cartReadModel.getByField('userId', user.id);
    } catch (error) {
      if (isError(error) && error.message === 'The requested cart does not exist') {
        const id = uuidv4();
        const command = new CreateCartCommand(user.id, id);
        await this.commandBus.send(command);
        cart = {
          id,
          userId: user.id,
          items: [],
          version: 0,
        };
      }

      throw error;
    }

    const data: any = {
      success: true,
      token: createJWToken({
        sessionData: user,
        maxAge: 3600,
      }),
      id: user.id,
      cart,
    };

    return res.json(ok('Successfully logged in', data));

    /*
    res.status(200).json({
      success: true,
      token: createJWToken({
        sessionData: user,
        maxAge: 3600,
      }),
    });
    */
  }
}

function isError(error: unknown): error is Error {
  return (error as Error).message !== undefined && (error as Error).stack !== undefined;
}
