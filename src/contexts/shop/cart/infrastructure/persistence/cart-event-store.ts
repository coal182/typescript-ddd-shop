import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';

import { TYPES } from '@storeback/shared/constants/types';
import { EventBus } from '@core/event-bus';
import { IEventStore } from '@core/i-event-store';
import { EventStore } from '@infrastructure/event-store/event-store';

@injectable()
export class CartEventStore extends EventStore implements IEventStore {
  constructor(@inject(TYPES.Db) private readonly db: Db, @inject(TYPES.EventBus) private readonly eventBus: EventBus) {
    super(db.collection('cart-events'), eventBus);
  }
}
