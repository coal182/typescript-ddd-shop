import { inject, injectable, named } from 'inversify';

import { EVENT_STREAM_NAMES, TYPES } from '@constants/types';
import { IEventStore } from '@core/i-event-store';
import { Repository } from '@infrastructure/repositories/repository';
import { Cart } from '@storeback/cart/domain/cart';
import { ICartRepository } from '@storeback/cart/domain/i-cart-repository';

@injectable()
export class CartRepository extends Repository<Cart> implements ICartRepository {
  constructor(@inject(TYPES.EventStore) @named(EVENT_STREAM_NAMES.Cart) private readonly eventstore: IEventStore) {
    super(eventstore, Cart);
  }
}
