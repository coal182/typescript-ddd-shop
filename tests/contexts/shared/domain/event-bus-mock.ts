import {DomainEventSubscribers} from '@infrastructure/event-bus/domain-event-subscribers';
import {DomainEvent} from '@shared/domain/domain-event';
import {EventBus} from '@shared/domain/event-bus';
import {expect} from 'chai';
import {spy} from 'sinon';

export default class EventBusMock implements EventBus {
    private publishSpy = spy();

    async publish(events: DomainEvent[]): Promise<void> {
        this.publishSpy(events);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addSubscribers(subscribers: DomainEventSubscribers): void {}

    assertLastPublishedEventIs(expectedEvent: DomainEvent): void {
        const publishSpyCalls = this.publishSpy.getCalls();

        expect(publishSpyCalls.length).to.be.greaterThan(0);

        const lastPublishSpyCall = publishSpyCalls[publishSpyCalls.length - 1];
        const lastPublishedEvent = lastPublishSpyCall.args[0][0];

        const expected = this.getDataFromDomainEvent(expectedEvent);
        const published = this.getDataFromDomainEvent(lastPublishedEvent);

        expect(expected).to.deep.equal(published);
    }

    private getDataFromDomainEvent(event: DomainEvent): Pick<DomainEvent, 'aggregateId' | 'eventName'> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {eventId, occurredOn, ...data} = event; // we get rid of eventId, occurredOn because its variability

        return data;
    }
}
