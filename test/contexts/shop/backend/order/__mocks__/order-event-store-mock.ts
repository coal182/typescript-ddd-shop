import { expect } from 'chai';
import { SinonStub, stub } from 'sinon';

import { DomainEvent } from '@shared/domain/domain-event';
import { Uuid } from '@shared/domain/value-objects/uuid';
import { OrderEventStore } from '@storeback/order/domain/order-event-store';

export class OrderEventStoreMock implements OrderEventStore {
  private saveMock: SinonStub;
  private findByAggregateIdMock: SinonStub;
  private domainEvents: Array<DomainEvent> = [];

  constructor() {
    this.saveMock = stub();
    this.findByAggregateIdMock = stub();
  }
  async save(domainEvent: DomainEvent[]): Promise<void> {
    this.saveMock(domainEvent);
  }

  assertSaveHaveBeenCalledWith(expectedEvents: DomainEvent[]): void {
    const expected = this.getDataFromDomainEvent(expectedEvents);
    const calls = this.saveMock
      .getCalls()
      .map((call) => call.args[0])
      .flat();
    const saved = this.getDataFromDomainEvent(calls);
    expect(saved).to.deep.equal(expected);
  }

  returnFindByAggregateId(domainEvents: Array<DomainEvent>) {
    this.domainEvents = domainEvents;
  }

  async findByAggregateId(aggregateId: Uuid): Promise<DomainEvent[]> {
    this.findByAggregateIdMock(aggregateId);
    return this.domainEvents;
  }

  private getDataFromDomainEvent(events: DomainEvent[]) {
    return events.map((event) => {
      const { eventId, occurredOn, ...attributes } = event; // we get rid of eventId, occurredOn because its variability

      return attributes;
    });
  }
}
