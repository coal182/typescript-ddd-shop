import { expect } from 'chai';
import { spy } from 'sinon';

import { DomainEventSubscribers } from '@infrastructure/event-bus/domain-event-subscribers';
import { DomainEvent } from '@shared/domain/domain-event';
import { EventBus } from '@shared/domain/event-bus';

export default class EventBusMock implements EventBus {
  private publishSpy = spy();

  async publish(events: DomainEvent[]) {
    this.publishSpy(events);
  }

  addSubscribers(subscribers: DomainEventSubscribers): void {}

  assertLastPublishedEventIs(expectedEvent: DomainEvent) {
    const publishSpyCalls = this.publishSpy.getCalls();

    expect(publishSpyCalls.length).to.be.greaterThan(0);

    const lastPublishSpyCall = publishSpyCalls[publishSpyCalls.length - 1];
    const lastPublishedEvent = lastPublishSpyCall.args[0][0];

    const expected = this.getDataFromDomainEvent(expectedEvent);
    const published = this.getDataFromDomainEvent(lastPublishedEvent);

    expect(expected).to.deep.equal(published);
  }

  private getDataFromDomainEvent(event: DomainEvent) {
    const { eventId, occurredOn, ...data } = event; // we get rid of eventId, occurredOn because its variability

    return data;
  }
}
