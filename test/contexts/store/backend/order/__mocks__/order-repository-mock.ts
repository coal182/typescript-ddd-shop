import { inject, injectable, named } from 'inversify';

import { EVENT_STREAM_NAMES, TYPES } from '@constants/types';
import { IEventStore } from '@core/i-event-store';
import { IOrderRepository } from '@storeback/order/domain/i-order-repository';
import { Order } from '@storeback/order/domain/order';
import { RepositoryMock } from 'test/shared/infrastructure/repositories/repository-mock';

@injectable()
export class OrderRepositoryMock extends RepositoryMock<Order> implements IOrderRepository {
  constructor(@inject(TYPES.EventStore) @named(EVENT_STREAM_NAMES.Order) private readonly eventstore: IEventStore) {
    super(eventstore, Order);
  }
}
