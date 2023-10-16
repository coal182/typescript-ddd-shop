import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { QueryBus } from '@shared/domain/query-bus';
import { ProductId } from '@shared/product/domain/product-id';
import { ProductReviewsResponse } from '@shop-backend/product-review/application/product-review-response';
import { SearchProductReviewsByProductIdQuery } from '@shop-backend/product-review/application/search-by-product-id/search-product-reviews-by-product-id-query';

export class ProductReviewGetByProductIdController {
  constructor(private readonly queryBus: QueryBus) {}

  async run(_req: Request, res: Response) {
    const { id } = _req.params;

    try {
      const query = new SearchProductReviewsByProductIdQuery(new ProductId(id));

      const productReviewsResponse = await this.queryBus.ask<ProductReviewsResponse>(query);

      res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        message: 'Successfully retrieved product reviews',
        data: productReviewsResponse.productReviews,
      });
    } catch (error) {
      res.status(httpStatus.NOT_FOUND).send({ status: httpStatus.NOT_FOUND, message: 'Product Id not found' });
    }
  }
}
