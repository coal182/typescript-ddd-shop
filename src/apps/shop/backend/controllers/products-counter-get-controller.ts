import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { QueryBus } from '@shared/domain/query-bus';
import { FindProductsCounterQuery } from '@storeback/products-counter/application/find/find-products-counter-query';
import { FindProductsCounterResponse } from '@storeback/products-counter/application/find/find-products-counter-response';

export class ProductsCounterGetController {
  constructor(private readonly queryBus: QueryBus) {}

  async run(req: Request, res: Response) {
    const query = new FindProductsCounterQuery();

    const response = await this.queryBus.ask<FindProductsCounterResponse>(query);

    res
      .status(httpStatus.OK)
      .send({ status: httpStatus.OK, message: 'Successfully retrieved products count', total: response.total });
  }
}
