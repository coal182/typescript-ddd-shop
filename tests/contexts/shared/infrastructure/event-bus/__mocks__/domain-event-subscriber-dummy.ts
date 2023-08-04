import { expect } from 'chai';

import { DomainEvent, DomainEventClass } from '@shared/domain/domain-event';
import { DomainEventSubscriber } from '@shared/domain/domain-event-subscriber';

import { DomainEventDummy } from './domain-event-dummy';

export class DomainEventSubscriberDummy implements DomainEventSubscriber<DomainEventDummy> {
  static failsFirstTime() {
    return new DomainEventSubscriberDummy({ failsFirstTime: true });
  }

  static alwaysFails() {
    return new DomainEventSubscriberDummy({ alwaysFails: true });
  }

  private events: Array<DomainEvent>;
  private failsFirstTime = false;
  private alwaysFails = false;
  private alreadyFailed = false;

  constructor(params?: { failsFirstTime?: boolean; alwaysFails?: boolean }) {
    if (params?.failsFirstTime) {
      this.failsFirstTime = true;
    }
    if (params?.alwaysFails) {
      this.alwaysFails = true;
    }

    this.events = [];
  }

  subscribedTo(): DomainEventClass[] {
    return [DomainEventDummy];
  }

  async on(domainEvent: DomainEventDummy): Promise<void> {
    if (this.alwaysFails) {
      throw new Error();
    }

    if (!this.alreadyFailed && this.failsFirstTime) {
      this.alreadyFailed = true;
      throw new Error();
    }

    this.events.push(domainEvent);
  }

  async assertConsumedEvents(events: Array<DomainEvent>) {
    return new Promise((resolve: any, reject: any) => {
      setTimeout(() => {
        try {
          expect(this.events.length).to.be.equal(events.length);
          expect(this.events).to.be.equal(events);
          resolve();
        } catch (error: any) {
          reject(error);
        }
      }, 400);
    });
  }
}
