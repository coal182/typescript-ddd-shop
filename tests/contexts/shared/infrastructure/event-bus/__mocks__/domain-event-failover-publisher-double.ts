import {DomainEventFailoverPublisher} from '@infrastructure/event-bus/domain-event-failover-publisher/domain-event-failover-publisher';
import {DomainEvent} from '@shared/domain/domain-event';
import {expect} from 'chai';
import {SinonStub, stub} from 'sinon';

import {DomainEventDeserializerMother} from '../__mother__/domain-event-deserializer-mother';
import {RabbitMQMongoClientMother} from '../__mother__/rabbitmq-mongo-client-mother';

export class DomainEventFailoverPublisherDouble extends DomainEventFailoverPublisher {
    private publishMock: SinonStub;
    constructor() {
        super(RabbitMQMongoClientMother.create(), DomainEventDeserializerMother.create());
        this.publishMock = stub();
    }

    async publish(event: DomainEvent): Promise<void> {
        this.publishMock(event);
    }

    assertEventHasBeenPublished(event: DomainEvent): void {
        expect(this.publishMock).to.have.been.calledWith(event);
    }
}
