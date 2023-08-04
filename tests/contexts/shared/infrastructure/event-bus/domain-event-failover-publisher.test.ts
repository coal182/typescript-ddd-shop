import { expect } from 'chai';

import { DomainEventFailoverPublisher } from '@infrastructure/event-bus/domain-event-failover-publisher/domain-event-failover-publisher';

import { MongoEnvironmentArranger } from '../mongo/mongo-environment-arranger';

import { DomainEventDummyMother } from './__mocks__/domain-event-dummy';
import { DomainEventDeserializerMother } from './__mother__/domain-event-deserializer-mother';
import { RabbitMQMongoClientMother } from './__mother__/rabbitmq-mongo-client-mother';

describe('DomainEventFailoverPublisher test', () => {
  let arranger: MongoEnvironmentArranger;
  const mongoClient = RabbitMQMongoClientMother.create();
  const deserializer = DomainEventDeserializerMother.create();

  beforeEach(async () => {
    arranger = new MongoEnvironmentArranger(mongoClient);
    await arranger.arrange();
  });

  it('should save the published events', async () => {
    const eventBus = new DomainEventFailoverPublisher(mongoClient, deserializer);
    const event = DomainEventDummyMother.random();

    await eventBus.publish(event);

    expect(await eventBus.consume()).to.be.equal([event]);
  });
});
