import { IEventStore } from '@core/i-event-store';
import { EVENT_STREAM_NAMES, TYPES } from '@storeback/shared/constants/types';
import { inject, injectable, named } from 'inversify';

import { IOrderRepository } from 'src/contexts/shop/order/domain/i-order-repository';
import { Order } from 'src/contexts/shop/order/domain/order';
import { RepositoryMock } from 'test/shared/infrastructure/repositories/repository-mock';

@injectable()
export class OrderRepositoryMock extends RepositoryMock<Order> implements IOrderRepository {
  constructor(@inject(TYPES.EventStore) @named(EVENT_STREAM_NAMES.Order) private readonly eventstore: IEventStore) {
    super(eventstore, Order);
  }
}
