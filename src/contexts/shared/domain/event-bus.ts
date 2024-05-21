import {DomainEvent} from './domain-event';

import {DomainEventSubscribers} from '../infrastructure/event-bus/domain-event-subscribers';

export interface EventBus {
    publish(events: Array<DomainEvent>): Promise<void>;
    addSubscribers(subscribers: DomainEventSubscribers): void;
}
