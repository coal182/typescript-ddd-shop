import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';

import { TYPES } from '@constants/types';
import { IEventBus } from '@core/i-event-bus';
import { IEventStore } from '@core/i-event-store';
import { EventStore } from '@infrastructure/event-store/event-store';

@injectable()
export class OrderEventStore extends EventStore implements IEventStore {
  constructor(@inject(TYPES.Db) private readonly db: Db, @inject(TYPES.EventBus) private readonly eventBus: IEventBus) {
    super(db.collection('order-events'), eventBus);
  }
}
