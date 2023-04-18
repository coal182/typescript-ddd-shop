import { DomainEventSubscribers } from '@infrastructure/event-bus/domain-event-subscribers';

import { DomainEvent } from './domain-event';

export interface EventBus {
  publish(events: Array<DomainEvent>, channel?: string): Promise<void>;
  addSubscribers(subscribers: DomainEventSubscribers): void;
}
