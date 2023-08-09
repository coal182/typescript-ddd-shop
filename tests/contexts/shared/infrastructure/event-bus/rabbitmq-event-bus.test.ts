import { createStubInstance } from 'sinon';

import { DomainEventDeserializer } from '@infrastructure/event-bus/domain-event-deserializer';
import { DomainEventFailoverPublisher } from '@infrastructure/event-bus/domain-event-failover-publisher/domain-event-failover-publisher';
import { DomainEventSubscribers } from '@infrastructure/event-bus/domain-event-subscribers';
import { RabbitMQConfigurer } from '@infrastructure/event-bus/rabbitmq/rabbitmq-configurer';
import { RabbitMqConnection } from '@infrastructure/event-bus/rabbitmq/rabbitmq-connection';
import { RabbitMQConsumer } from '@infrastructure/event-bus/rabbitmq/rabbitmq-consumer';
import { RabbitMQEventBus } from '@infrastructure/event-bus/rabbitmq/rabbitmq-event-bus';
import { RabbitMQqueueFormatter } from '@infrastructure/event-bus/rabbitmq/rabbitmq-queue-formatter';
import WinstonLogger from '@infrastructure/winston-logger';
import { DomainEvent } from '@shared/domain/domain-event';

import { MongoEnvironmentArranger } from '../mongo/mongo-environment-arranger';

import { DomainEventDummyMother } from './__mocks__/domain-event-dummy';
import { DomainEventSubscriberDummy } from './__mocks__/domain-event-subscriber-dummy';
import { DomainEventFailoverPublisherMother } from './__mother__/domain-event-failover-publisher-mother';
import { RabbitMQConnectionMother } from './__mother__/rabbitmq-connection-mother';
import { RabbitMQMongoClientMother } from './__mother__/rabbitmq-mongo-client-mother';

describe('RabbitMQEventBus test', () => {
  const exchange = 'test_domain_events';
  let arranger: MongoEnvironmentArranger;
  const queueNameFormatter = new RabbitMQqueueFormatter('shop');
  const retryTtl = 50;
  const maxRetries = 3;
  const logger = createStubInstance(WinstonLogger);

  beforeEach(async () => {
    arranger = new MongoEnvironmentArranger(RabbitMQMongoClientMother.create());
    await arranger.arrange();
  });

  afterEach(async () => {
    await arranger.close();
  });

  describe('integration', () => {
    let connection: RabbitMqConnection;
    let dummySubscriber: DomainEventSubscriberDummy;
    let configurer: RabbitMQConfigurer;
    let failoverPublisher: DomainEventFailoverPublisher;
    let subscribers: DomainEventSubscribers;

    beforeEach(async () => {
      connection = await RabbitMQConnectionMother.create();
      failoverPublisher = DomainEventFailoverPublisherMother.create();
      configurer = new RabbitMQConfigurer(connection, queueNameFormatter);
      await arranger.arrange();
      dummySubscriber = new DomainEventSubscriberDummy();
      subscribers = new DomainEventSubscribers([dummySubscriber]);
    });

    afterEach(async () => {
      await cleanEnvironment();
      await connection.close();
    });

    it('should consume the events published to RabbitMQ', async () => {
      await configurer.configure({ exchange, subscribers: [dummySubscriber], retryTtl });
      const eventBus = new RabbitMQEventBus(
        {
          failoverPublisher,
          connection,
          exchange,
          queueNameFormatter,
          maxRetries,
        },
        logger
      );
      await eventBus.addSubscribers(subscribers);
      const event = DomainEventDummyMother.random();

      await eventBus.publish([event]);

      await dummySubscriber.assertConsumedEvents([event]);
    });

    it('should retry failed domain events', async () => {
      dummySubscriber = DomainEventSubscriberDummy.failsFirstTime();
      subscribers = new DomainEventSubscribers([dummySubscriber]);
      await configurer.configure({ exchange, subscribers: [dummySubscriber], retryTtl });
      const eventBus = new RabbitMQEventBus(
        {
          failoverPublisher,
          connection,
          exchange,
          queueNameFormatter,
          maxRetries,
        },
        logger
      );
      await eventBus.addSubscribers(subscribers);
      const event = DomainEventDummyMother.random();

      await eventBus.publish([event]);

      await dummySubscriber.assertConsumedEvents([event]);
    });

    it('it should send events to dead letter after retry failed', async () => {
      dummySubscriber = DomainEventSubscriberDummy.alwaysFails();
      subscribers = new DomainEventSubscribers([dummySubscriber]);
      await configurer.configure({ exchange, subscribers: [dummySubscriber], retryTtl });
      const eventBus = new RabbitMQEventBus(
        {
          failoverPublisher,
          connection,
          exchange,
          queueNameFormatter,
          maxRetries,
        },
        logger
      );
      await eventBus.addSubscribers(subscribers);
      const event = DomainEventDummyMother.random();

      await eventBus.publish([event]);

      await dummySubscriber.assertConsumedEvents([]);
      assertDeadLetter([event]);
    });

    async function cleanEnvironment() {
      await connection.deleteQueue(queueNameFormatter.format(dummySubscriber));
      await connection.deleteQueue(queueNameFormatter.formatRetry(dummySubscriber));
      await connection.deleteQueue(queueNameFormatter.formatDeadLetter(dummySubscriber));
    }

    async function assertDeadLetter(events: Array<DomainEvent>) {
      const deadLetterQueue = queueNameFormatter.formatDeadLetter(dummySubscriber);
      const deadLetterSubscriber = new DomainEventSubscriberDummy();
      const deadLetterSubscribers = new DomainEventSubscribers([dummySubscriber]);
      const deserializer = DomainEventDeserializer.configure(deadLetterSubscribers);
      const consumer = new RabbitMQConsumer(
        {
          subscriber: deadLetterSubscriber,
          deserializer,
          connection,
          maxRetries,
          queueName: deadLetterQueue,
          exchange,
        },
        logger
      );
      await connection.consume(deadLetterQueue, consumer.onMessage.bind(consumer));

      await deadLetterSubscriber.assertConsumedEvents(events);
    }
  });
});
