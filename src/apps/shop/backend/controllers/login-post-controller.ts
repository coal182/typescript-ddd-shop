import { compareSync } from 'bcryptjs';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { v4 as uuidv4 } from 'uuid';

import { CommandBus } from '@shared/domain/command-bus';
import { PasswordNotMatchException } from '@shared/domain/errors/application-error';
import { QueryBus } from '@shared/domain/query-bus';
import { CartResponse, CartsResponse } from '@shop-backend/cart/application/cart-response';
import { CreateCartCommand } from '@shop-backend/cart/application/commands/create-cart';
import { SearchCartsByCriteriaQuery } from '@shop-backend/cart/application/search-by-criteria/search-carts-by-criteria-query';
import { SearchUsersByCriteriaQuery } from '@shop-backend/user/application/search-by-criteria/search-users-by-criteria-query';
import { UsersResponse } from '@shop-backend/user/application/user-response';

import { createJWToken } from '../middlewares/auth';
import { ok } from '../processors/response';

type FilterType = { value: string; operator: string; field: string };

export class LoginPostController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  async run(req: Request, res: Response) {
    const { email, password } = req.body;

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

    const cart = await this.buildCart(user.id);

    const data: any = {
      success: true,
      token: createJWToken({
        sessionData: user,
        maxAge: 3600,
      }),
      id: user.id,
      cart: { id: cart.id, userId: cart.userId },
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

  private async buildCart(userId: string): Promise<CartResponse> {
    const cartFilters: Array<FilterType> = [{ field: 'userId', operator: '=', value: userId }];
    const cartOrderBy = 'id';
    const cartOrder = 'asc';

    const cartQuery = new SearchCartsByCriteriaQuery(
      this.parseFilters(cartFilters as Array<FilterType>),
      cartOrderBy as string,
      cartOrder as string,
      undefined,
      undefined
    );

    const cartsResponse = await this.queryBus.ask<CartsResponse>(cartQuery);

    if (cartsResponse.carts.length > 0) {
      return cartsResponse.carts[0];
    }

    const id = uuidv4();

    const createCommand = new CreateCartCommand(id, userId);
    console.log('📌 ~ id:', id);
    await this.commandBus.dispatch(createCommand);
    return {
      id,
      userId,
      items: [],
    };
  }
}

function isError(error: unknown): error is Error {
  return (error as Error).message !== undefined && (error as Error).stack !== undefined;
}
