import { compareSync } from 'bcryptjs';
import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpPost, request, response } from 'inversify-express-utils';

import { TYPES } from '@constants/types';
import { PasswordNotMatchException } from '@core/application-error';
import { CommandBus } from '@infrastructure/command-bus';
import { IUserReadModelFacade } from '@storeback/user/infrastructure/projection/users/read-model';

import { createJWToken } from '../middlewares/auth';
import { ok } from '../processors/response';

@controller('/api/v1/login')
export class LoginController {
  constructor(
    @inject(TYPES.CommandBus) private readonly commandBus: CommandBus,
    @inject(TYPES.UserReadModelFacade) private readonly userReadModel: IUserReadModelFacade
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

    const data: any = {
      success: true,
      token: createJWToken({
        sessionData: user,
        maxAge: 3600,
      }),
      _id: user._id,
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
