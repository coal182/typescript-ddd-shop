import {QueryBus} from '@shared/domain/query-bus';
import {FindProductsCounterQuery} from '@shop-backend/products-counter/application/find/find-products-counter-query';
import {FindProductsCounterResponse} from '@shop-backend/products-counter/application/find/find-products-counter-response';
import {Request, Response} from 'express';
import httpStatus from 'http-status';

export class ProductsCounterGetController {
    constructor(private readonly queryBus: QueryBus) {}

    async run(req: Request, res: Response): Promise<void> {
        const query = new FindProductsCounterQuery();

        const response = await this.queryBus.ask<FindProductsCounterResponse>(query);

        res.status(httpStatus.OK).send({status: httpStatus.OK, message: 'Successfully retrieved products count', total: response.total});
    }
}
