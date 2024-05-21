import {Criteria} from '@shared/domain/criteria/criteria';
import {Filters} from '@shared/domain/criteria/filters';
import {Order} from '@shared/domain/criteria/order';
import {CartRepository} from '@shop-backend/cart/domain/cart-repository';

import {CartsResponse} from '../cart-response';

export class CartsByCriteriaSearcher {
    constructor(private repository: CartRepository) {}

    async run(filters: Filters, order: Order, limit?: number, offset?: number): Promise<CartsResponse> {
        const criteria = new Criteria(filters, order, limit, offset);

        const carts = await this.repository.matching(criteria);

        return new CartsResponse(carts);
    }
}
