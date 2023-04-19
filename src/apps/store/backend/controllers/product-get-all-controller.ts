import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { QueryBus } from '@shared/domain/QueryBus';
import { ProductsResponse } from '@storeback/product/application/product-response';
import { SearchAllProductsQuery } from '@storeback/product/application/SearchAll/SearchAllProductsQuery';

export class ProductGetAllController {
  constructor(private readonly queryBus: QueryBus) {}

  async run(req: Request, res: Response) {
    const query = new SearchAllProductsQuery();

    const response = await this.queryBus.ask<ProductsResponse>(query);

    res.status(httpStatus.OK).send(response.products);
  }
}
