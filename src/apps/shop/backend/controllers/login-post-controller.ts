import { compareSync } from 'bcryptjs';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { CommandBus } from '@shared/domain/command-bus';
import { PasswordNotMatchException } from '@shared/domain/errors/application-error';
import { QueryBus } from '@shared/domain/query-bus';
import { SearchUsersByCriteriaQuery } from '@storeback/user/application/search-by-criteria/search-users-by-criteria-query';
import { UsersResponse } from '@storeback/user/application/user-response';

import { createJWToken } from '../middlewares/auth';
import { ok } from '../processors/response';

type FilterType = { value: string; operator: string; field: string };

export class LoginPostController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  async run(req: Request, res: Response) {
    const { email, password } = req.body;
    console.log('📌 ~ { email, password }:', { email, password });

    const filters: Array<FilterType> = [{ field: 'email', operator: '=', value: email }];
    const orderBy = 'email';
    const order = 'asc';

    const query = new SearchUsersByCriteriaQuery(
      this.parseFilters(filters as Array<FilterType>),
      orderBy as string,
      order as string,
      undefined,
      undefined
    );

    const response = await this.queryBus.ask<UsersResponse>(query);

    if (response.users.length === 0) {
      throw new PasswordNotMatchException('Email not found');
    }

    const user = response.users[0];

    if (!compareSync(password, user.password)) {
      throw new PasswordNotMatchException('Email or password is incorrect');
    }

    /*
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
    */

    const data: any = {
      success: true,
      token: createJWToken({
        sessionData: user,
        maxAge: 3600,
      }),
      id: user.id,
      //cart: { id: cart.id, userId: cart.userId, version: cart.version },
    };

    res.status(httpStatus.OK).send(ok('Successfully logged in', data));

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

  private parseFilters(params: Array<FilterType>): Array<Map<string, string>> {
    if (!params) {
      return new Array<Map<string, string>>();
    }

    return params.map((filter) => {
      const field = filter.field;
      const value = filter.value;
      const operator = filter.operator;

      return new Map([
        ['field', field],
        ['operator', operator],
        ['value', value],
      ]);
    });
  }
}

function isError(error: unknown): error is Error {
  return (error as Error).message !== undefined && (error as Error).stack !== undefined;
}
