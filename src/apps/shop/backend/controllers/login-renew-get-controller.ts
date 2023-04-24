import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { PasswordNotMatchException } from '@shared/domain/errors/application-error';
import { QueryBus } from '@shared/domain/query-bus';
import { SearchUsersByCriteriaQuery } from '@storeback/user/application/search-by-criteria/search-users-by-criteria-query';
import { UsersResponse } from '@storeback/user/application/user-response';

import { createJWToken } from '../middlewares/auth';
import { ok } from '../processors/response';

type FilterType = { value: string; operator: string; field: string };

export class LoginRenewGetController {
  constructor(private readonly queryBus: QueryBus) {}

  async run(req: Request, res: Response) {
    const { uid } = req.params;

    const filters: Array<FilterType> = [{ field: 'id', operator: '=', value: uid }];
    const orderBy = 'id';
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
      throw new PasswordNotMatchException('User not found');
    }

    const user = response.users[0];

    const data: any = {
      success: true,
      token: createJWToken({
        sessionData: user,
        maxAge: 3600,
      }),
      id: user.id,
    };

    res.status(httpStatus.OK).send(ok('Successfully renewed it', data));
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
