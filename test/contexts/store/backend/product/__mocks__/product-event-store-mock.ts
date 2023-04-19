import { IEventStore } from '@core/i-event-store';
import { EventStoreMock } from 'test/shared/infrastructure/event-store/event-store-mock';

export class ProductEventStoreMock extends EventStoreMock implements IEventStore {
  constructor() {
    super();
  }
}
