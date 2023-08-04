import { Given } from '@cucumber/cucumber';

import { DomainEventDeserializer } from '@infrastructure/event-bus/domain-event-deserializer';
import { DomainEventSubscribers } from '@infrastructure/event-bus/domain-event-subscribers';

import { application, eventBus } from './hooks.steps';

Given('the following event is received:', async (event: any) => {
  const deserializer = buildDeserializer();
  const domainEvent = deserializer.deserialize(event)!;

  await eventBus.publish([domainEvent]);
  await wait(500);
});

Given('another event is received:', async (event: any) => {
  const deserializer = buildDeserializer();
  const domainEvent = deserializer.deserialize(event)!;

  await eventBus.publish([domainEvent]);
  await wait(500);
});

function buildDeserializer() {
  const subscribers = DomainEventSubscribers.from(application.container);
  return DomainEventDeserializer.configure(subscribers);
}

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
