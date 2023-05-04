import { expect } from 'chai';
import { SinonStub, stub } from 'sinon';

import { DomainEvent } from '@shared/domain/domain-event';
import { Uuid } from '@shared/domain/value-objects/uuid';
import { ProductEventStore } from '@storeback/product/domain/product-event-store';

export class ProductEventStoreMock implements ProductEventStore {
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
    const saved = this.getDataFromDomainEvent(this.saveMock.getCall(0).args[0]);
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
