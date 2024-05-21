import {EventEmitter} from 'events';

import {DomainEvent} from '../../../domain/domain-event';
import {EventBus} from '../../../domain/event-bus';
import {DomainEventSubscribers} from '../domain-event-subscribers';

export class InMemoryAsyncEventBus extends EventEmitter implements EventBus {
    async publish(events: DomainEvent[]): Promise<void> {
        events.map((event) => this.emit(event.eventName, event));
    }

    addSubscribers(subscribers: DomainEventSubscribers): void {
        subscribers.items.forEach((subscriber) => {
            subscriber.subscribedTo().forEach((event) => {
                this.on(event.EVENT_NAME, subscriber.on.bind(subscriber));
            });
        });
    }
}
