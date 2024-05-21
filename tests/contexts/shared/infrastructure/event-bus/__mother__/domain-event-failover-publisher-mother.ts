import {DomainEventFailoverPublisher} from '@infrastructure/event-bus/domain-event-failover-publisher/domain-event-failover-publisher';

import {DomainEventDeserializerMother} from './domain-event-deserializer-mother';
import {RabbitMQMongoClientMother} from './rabbitmq-mongo-client-mother';

import {DomainEventFailoverPublisherDouble} from '../__mocks__/domain-event-failover-publisher-double';

export class DomainEventFailoverPublisherMother {
    static create(): DomainEventFailoverPublisher {
        const mongoClient = RabbitMQMongoClientMother.create();
        return new DomainEventFailoverPublisher(mongoClient, DomainEventDeserializerMother.create());
    }

    static failOverDouble(): DomainEventFailoverPublisherDouble {
        return new DomainEventFailoverPublisherDouble();
    }
}
