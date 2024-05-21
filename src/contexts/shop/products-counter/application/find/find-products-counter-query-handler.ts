import {Query} from '@shared/domain/query';
import {QueryHandler} from '@shared/domain/query-handler';

import {FindProductsCounterQuery} from './find-products-counter-query';
import {FindProductsCounterResponse} from './find-products-counter-response';
import {ProductsCounterFinder} from './products-counter-finder';

export class FindProductsCounterQueryHandler implements QueryHandler<FindProductsCounterQuery, FindProductsCounterResponse> {
    constructor(private finder: ProductsCounterFinder) {}

    subscribedTo(): Query {
        return FindProductsCounterQuery;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(query: FindProductsCounterQuery): Promise<FindProductsCounterResponse> {
        const counter = await this.finder.run();
        return new FindProductsCounterResponse(counter);
    }
}
