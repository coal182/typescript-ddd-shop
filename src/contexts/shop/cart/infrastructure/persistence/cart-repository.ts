import { inject, injectable, named } from 'inversify';

import { EVENT_STREAM_NAMES, TYPES } from '@storeback/shared/constants/types';
import { IEventStore } from '@core/i-event-store';
import { Repository } from '@infrastructure/repositories/repository';
import { Cart } from 'src/contexts/shop/cart/domain/cart';
import { ICartRepository } from 'src/contexts/shop/cart/domain/i-cart-repository';

@injectable()
export class CartRepository extends Repository<Cart> implements ICartRepository {
  constructor(@inject(TYPES.EventStore) @named(EVENT_STREAM_NAMES.Cart) private readonly eventstore: IEventStore) {
    super(eventstore, Cart);
  }
}
