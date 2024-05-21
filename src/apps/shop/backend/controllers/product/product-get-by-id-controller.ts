import {QueryBus} from '@shared/domain/query-bus';
import {ProductId} from '@shared/product/domain/product-id';
import {SearchProductByIdQuery} from '@shop-backend/product/application/search-by-id/search-product-by-id-query';
import {Request, Response} from 'express';
import httpStatus from 'http-status';
import {ProductResponse} from 'src/contexts/shop/product/application/product-response';

export class ProductGetByIdController {
    constructor(private readonly queryBus: QueryBus) {}

    async run(_req: Request, res: Response): Promise<void> {
        const {id} = _req.params;

        try {
            const query = new SearchProductByIdQuery(new ProductId(id));

            const productResponse = await this.queryBus.ask<ProductResponse>(query);
            res.status(httpStatus.OK).send({status: httpStatus.OK, message: 'Successfully retrieved products', data: productResponse});
        } catch (error) {
            res.status(httpStatus.NOT_FOUND).send({status: httpStatus.NOT_FOUND, message: 'Product Id not found'});
        }
    }
}
