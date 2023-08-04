import { DomainEventDeserializer } from '@infrastructure/event-bus/domain-event-deserializer';
import { DomainEventSubscribers } from '@infrastructure/event-bus/domain-event-subscribers';

import { DomainEventSubscriberDummy } from '../__mocks__/domain-event-subscriber-dummy';

export class DomainEventDeserializerMother {
  static create() {
    const dummySubscriber = new DomainEventSubscriberDummy();
    const subscribers = new DomainEventSubscribers([dummySubscriber]);
    return DomainEventDeserializer.configure(subscribers);
  }
}
