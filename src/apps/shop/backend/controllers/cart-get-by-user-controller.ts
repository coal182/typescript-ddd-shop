import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { QueryBus } from '@shared/domain/query-bus';
import { CartsResponse } from '@storeback/cart/application/cart-response';
import { SearchCartsByCriteriaQuery } from '@storeback/cart/application/search-by-criteria/search-carts-by-criteria-query';

type FilterType = { value: string; operator: string; field: string };

export class CartGetByUserController {
  constructor(private readonly queryBus: QueryBus) {}

  async run(_req: Request, res: Response) {
    const { id } = _req.params;

    const filters: Array<FilterType> = [{ field: 'userId', operator: '=', value: id }];
    const orderBy = 'id';
    const order = 'asc';

    const query = new SearchCartsByCriteriaQuery(
      this.parseFilters(filters as Array<FilterType>),
      orderBy as string,
      order as string,
      undefined,
      undefined
    );

    const response = await this.queryBus.ask<CartsResponse>(query);

    res
      .status(httpStatus.OK)
      .send({ status: httpStatus.OK, message: 'Sucessfully retrieved cart', data: response.carts[0] });
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
