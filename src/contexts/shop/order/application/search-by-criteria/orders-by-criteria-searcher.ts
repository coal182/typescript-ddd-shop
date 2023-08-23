import { Criteria } from '@shared/domain/criteria/criteria';
import { Filters } from '@shared/domain/criteria/filters';
import { Order } from '@shared/domain/criteria/order';
import { OrderRepository } from '@shop-backend/order/domain/order-repository';

import { OrdersResponse } from '../order-response';

export class OrdersByCriteriaSearcher {
  constructor(private repository: OrderRepository) {}

  async run(filters: Filters, order: Order, limit?: number, offset?: number): Promise<OrdersResponse> {
    const criteria = new Criteria(filters, order, limit, offset);

    const orders = await this.repository.matching(criteria);

    return new OrdersResponse(orders);
  }
}
