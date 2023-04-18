import { ContainerBuilder } from 'node-dependency-injection';

import { DomainEvent } from '../../domain/DomainEvent';
import { DomainEventSubscriber } from '../../domain/DomainEventSubscriber';

export class DomainEventSubscribers {
  constructor(public items: Array<DomainEventSubscriber<DomainEvent>>) {}

  static from(container: ContainerBuilder): DomainEventSubscribers {
    const subscriberDefinitions = container.findTaggedServiceIds('domainEventSubscriber');
    const subscribers: Array<DomainEventSubscriber<DomainEvent>> = [];

    for (const { id } of subscriberDefinitions) {
      const domainEventSubscriber = container.get<DomainEventSubscriber<DomainEvent>>(id.toString());
      subscribers.push(domainEventSubscriber);
    }

    return new DomainEventSubscribers(subscribers);
  }
}
