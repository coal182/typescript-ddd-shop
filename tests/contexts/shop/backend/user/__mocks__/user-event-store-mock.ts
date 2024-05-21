import {DomainEvent} from '@shared/domain/domain-event';
import {Uuid} from '@shared/domain/value-objects/uuid';
import {UserEventStore} from '@shop-backend/user/domain/user-event-store';
import {expect} from 'chai';
import {SinonStub, stub} from 'sinon';

export class UserEventStoreMock implements UserEventStore {
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

    returnFindByAggregateId(domainEvents: Array<DomainEvent>): void {
        this.domainEvents = domainEvents;
    }

    async findByAggregateId(aggregateId: Uuid): Promise<DomainEvent[]> {
        this.findByAggregateIdMock(aggregateId);
        return this.domainEvents;
    }

    private getDataFromDomainEvent(events: DomainEvent[]): ReadonlyArray<Pick<DomainEvent, 'aggregateId' | 'eventName'>> {
        return events.map((event) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {eventId, occurredOn, ...attributes} = event; // we get rid of eventId, occurredOn because its variability

            return attributes;
        });
    }
}
