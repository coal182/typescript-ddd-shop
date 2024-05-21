import {Query} from '@shared/domain/query';
import {QueryHandler} from '@shared/domain/query-handler';

import {SearchAllUsersQuery} from './search-all-users-query';
import {UsersFinder} from './users-finder';

import {UsersResponse} from '../user-response';

export class SearchAllUsersQueryHandler implements QueryHandler<SearchAllUsersQuery, UsersResponse> {
    constructor(private readonly usersFinder: UsersFinder) {}

    subscribedTo(): Query {
        return SearchAllUsersQuery;
    }

    async handle(): Promise<UsersResponse> {
        return new UsersResponse(await this.usersFinder.run());
    }
}
