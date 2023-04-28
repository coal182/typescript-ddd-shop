import { Query } from '@shared/domain/query';
import { QueryHandler } from '@shared/domain/query-handler';

import { OrdersResponse } from '../order-response';

import { OrdersFinder } from './orders-finder';
import { SearchAllOrdersQuery } from './search-all-orders-query';

export class SearchAllOrdersQueryHandler implements QueryHandler<SearchAllOrdersQuery, OrdersResponse> {
  constructor(private readonly ordersFinder: OrdersFinder) {}

  subscribedTo(): Query {
    return SearchAllOrdersQuery;
  }

  async handle(): Promise<OrdersResponse> {
    return new OrdersResponse(await this.ordersFinder.run());
  }
}
