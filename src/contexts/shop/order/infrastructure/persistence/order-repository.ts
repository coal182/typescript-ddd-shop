import { inject, injectable, named } from 'inversify';

import { EVENT_STREAM_NAMES, TYPES } from '@storeback/shared/constants/types';
import { IEventStore } from '@core/i-event-store';
import { Repository } from '@infrastructure/repositories/repository';

import { IOrderRepository } from '../../domain/i-order-repository';
import { Order } from '../../domain/order';

@injectable()
export class OrderRepository extends Repository<Order> implements IOrderRepository {
  constructor(@inject(TYPES.EventStore) @named(EVENT_STREAM_NAMES.Order) private readonly eventstore: IEventStore) {
    super(eventstore, Order);
  }
}
