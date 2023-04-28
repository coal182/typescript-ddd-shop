import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { QueryBus } from '@shared/domain/query-bus';
import { OrdersResponse } from '@storeback/order/application/order-response';
import { SearchOrdersByCriteriaQuery } from '@storeback/order/application/search-by-criteria/search-orders-by-criteria-query';

type FilterType = { value: string; operator: string; field: string };

export class OrderGetByUserController {
  constructor(private readonly queryBus: QueryBus) {}

  async run(_req: Request, res: Response) {
    const { id } = _req.params;

    const filters: Array<FilterType> = [{ field: 'userId', operator: '=', value: id }];
    const orderBy = 'id';
    const order = 'asc';

    const query = new SearchOrdersByCriteriaQuery(
      this.parseFilters(filters as Array<FilterType>),
      orderBy as string,
      order as string,
      undefined,
      undefined
    );

    const response = await this.queryBus.ask<OrdersResponse>(query);

    res.status(httpStatus.OK).send(response.orders);
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
