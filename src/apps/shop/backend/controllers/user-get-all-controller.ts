import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { QueryBus } from '@shared/domain/query-bus';
import { SearchAllUsersQuery } from '@storeback/user/application/search-all/search-all-users-query';
import { UsersResponse } from 'src/contexts/shop/user/application/user-response';

export class UserGetAllController {
  constructor(private readonly queryBus: QueryBus) {}

  async run(req: Request, res: Response) {
    const query = new SearchAllUsersQuery();

    const response = await this.queryBus.ask<UsersResponse>(query);

    res.status(httpStatus.OK).send(response.users);
  }
}
