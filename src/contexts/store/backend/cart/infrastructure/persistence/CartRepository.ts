import { inject, injectable, named } from 'inversify';

import { EVENT_STREAM_NAMES, TYPES } from '@constants/types';
import { IEventStore } from '@core/IEventStore';
import { Repository } from '@infrastructure/repositories/Repository';
import { Cart } from '@storeback/cart/domain/Cart';
import { ICartRepository } from '@storeback/cart/domain/ICartRepository';

@injectable()
export class CartRepository extends Repository<Cart> implements ICartRepository {
  constructor(@inject(TYPES.EventStore) @named(EVENT_STREAM_NAMES.Cart) private readonly eventstore: IEventStore) {
    super(eventstore, Cart);
  }
}
