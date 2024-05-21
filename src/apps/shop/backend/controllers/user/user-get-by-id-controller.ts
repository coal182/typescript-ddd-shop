import {QueryBus} from '@shared/domain/query-bus';
import {SearchUsersByCriteriaQuery} from '@shop-backend/user/application/search-by-criteria/search-users-by-criteria-query';
import {Request, Response} from 'express';
import httpStatus from 'http-status';
import {UsersResponse} from 'src/contexts/shop/user/application/user-response';

type FilterType = {value: string; operator: string; field: string};

export class UserGetByIdController {
    constructor(private readonly queryBus: QueryBus) {}

    async run(_req: Request, res: Response): Promise<void> {
        const {id} = _req.params;

        const filters: Array<FilterType> = [{field: 'id', operator: '=', value: id}];
        const orderBy = 'id';
        const order = 'asc';

        const query = new SearchUsersByCriteriaQuery(this.parseFilters(filters as Array<FilterType>), orderBy as string, order as string, undefined, undefined);

        const response = await this.queryBus.ask<UsersResponse>(query);

        res.status(httpStatus.OK).send({status: httpStatus.OK, message: 'Sucessfully retrieved user', data: response.users[0]});
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
