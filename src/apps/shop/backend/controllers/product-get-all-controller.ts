import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { QueryBus } from '@shared/domain/query-bus';
import { SearchAllProductsQuery } from '@storeback/product/application/search-all/search-all-products-query';
import { ProductsResponse } from 'src/contexts/shop/product/application/product-response';

export class ProductGetAllController {
  constructor(private readonly queryBus: QueryBus) {}

  async run(req: Request, res: Response) {
    const query = new SearchAllProductsQuery();

    const response = await this.queryBus.ask<ProductsResponse>(query);

    res
      .status(httpStatus.OK)
      .send({ status: httpStatus.OK, message: 'Successfully retrieved products', data: response.products });
  }
}
