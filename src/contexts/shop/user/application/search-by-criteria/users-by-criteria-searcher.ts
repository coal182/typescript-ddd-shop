import {Criteria} from '@shared/domain/criteria/criteria';
import {Filters} from '@shared/domain/criteria/filters';
import {Order} from '@shared/domain/criteria/order';

import {UserRepository} from '../../domain/user-repository';
import {UsersResponse} from '../user-response';

export class UsersByCriteriaSearcher {
    constructor(private repository: UserRepository) {}

    async run(filters: Filters, order: Order, limit?: number, offset?: number): Promise<UsersResponse> {
        const criteria = new Criteria(filters, order, limit, offset);

        const users = await this.repository.matching(criteria);

        return new UsersResponse(users);
    }
}
