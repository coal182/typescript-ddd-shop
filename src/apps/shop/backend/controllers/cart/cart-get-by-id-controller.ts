import {QueryBus} from '@shared/domain/query-bus';
import {CartsResponse} from '@shop-backend/cart/application/cart-response';
import {SearchCartsByCriteriaQuery} from '@shop-backend/cart/application/search-by-criteria/search-carts-by-criteria-query';
import {Request, Response} from 'express';
import httpStatus from 'http-status';

type FilterType = {value: string; operator: string; field: string};

export class CartGetByIdController {
    constructor(private readonly queryBus: QueryBus) {}

    async run(_req: Request, res: Response): Promise<void> {
        const {id} = _req.params;

        const filters: Array<FilterType> = [{field: 'id', operator: '=', value: id}];
        const orderBy = 'id';
        const order = 'asc';

        const query = new SearchCartsByCriteriaQuery(this.parseFilters(filters as Array<FilterType>), orderBy as string, order as string, undefined, undefined);

        const response = await this.queryBus.ask<CartsResponse>(query);

        res.status(httpStatus.OK).send(response.carts);
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
