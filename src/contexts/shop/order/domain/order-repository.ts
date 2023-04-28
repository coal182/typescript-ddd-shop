import { Criteria } from '@shared/domain/criteria/criteria';
import { Nullable } from '@shared/domain/nullable';

import { Order } from './order';
import { OrderId } from './order-id';

export interface OrderRepository {
  save(order: Order): Promise<void>;
  search(id: OrderId): Promise<Nullable<Order>>;
  searchAll(): Promise<Array<Order>>;
  matching(criteria: Criteria): Promise<Array<Order>>;
}
