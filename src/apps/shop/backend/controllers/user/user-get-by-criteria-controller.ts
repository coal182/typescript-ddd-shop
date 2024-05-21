import {QueryBus} from '@shared/domain/query-bus';
import {SearchUsersByCriteriaQuery} from '@shop-backend/user/application/search-by-criteria/search-users-by-criteria-query';
import {Request, Response} from 'express';
import httpStatus from 'http-status';
import {UsersResponse} from 'src/contexts/shop/user/application/user-response';

type FilterType = {value: string; operator: string; field: string};

export class UserGetByCriteriaController {
    constructor(private readonly queryBus: QueryBus) {}

    async run(_req: Request, res: Response): Promise<void> {
        const {query: queryParams} = _req;
        const {filters, orderBy, order, limit, offset} = queryParams;

        const query = new SearchUsersByCriteriaQuery(
            this.parseFilters(filters as Array<FilterType>),
            orderBy as string,
            order as string,
            limit ? Number(limit) : undefined,
            offset ? Number(offset) : undefined,
        );

        const response = await this.queryBus.ask<UsersResponse>(query);

        res.status(httpStatus.OK).send(response.users);
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
