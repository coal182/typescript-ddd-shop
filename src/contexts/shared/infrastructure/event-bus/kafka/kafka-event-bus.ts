import { Message } from 'kafkajs';

import WinstonLogger from '@infrastructure/winston-logger';

import { DomainEvent } from '../../../domain/domain-event';
import { EventBus } from '../../../domain/event-bus';
import { DomainEventDeserializer } from '../domain-event-deserializer';
import { DomainEventFailoverPublisher } from '../domain-event-failover-publisher/domain-event-failover-publisher';
import { DomainEventJsonSerializer } from '../domain-event-json-serializer';
import { DomainEventSubscribers } from '../domain-event-subscribers';

import { KafkaConnection } from './kafka-connection';
import { KafkaConsumerFactory } from './kafka-consumer-factory';
import { KafkaTopicFormatter } from './kafka-topic-formatter';

export class KafkaEventBus implements EventBus {
  private failoverPublisher: DomainEventFailoverPublisher;
  private connection: KafkaConnection;
  private topicNameFormatter: KafkaTopicFormatter;

  constructor(
    params: {
      failoverPublisher: DomainEventFailoverPublisher;
      connection: KafkaConnection;
      topicNameFormatter: KafkaTopicFormatter;
    },
    private logger: WinstonLogger
  ) {
    const { failoverPublisher, connection } = params;
    this.failoverPublisher = failoverPublisher;
    this.connection = connection;
    this.topicNameFormatter = params.topicNameFormatter;
  }

  async addSubscribers(subscribers: DomainEventSubscribers): Promise<void> {
    const deserializer = DomainEventDeserializer.configure(subscribers);
    const consumerFactory = new KafkaConsumerFactory(deserializer, this.logger);

    const subscriptions = subscribers.items.map((subscriber) => {
      const topicName = this.topicNameFormatter.formatFromSubscriber(subscriber);
      const kafkaConsumer = consumerFactory.build(subscriber, topicName);

      return { topic: topicName, onMessage: kafkaConsumer.onMessage.bind(kafkaConsumer) };
    });

    await this.connection.consume(subscriptions);
  }

  async publish(events: Array<DomainEvent>): Promise<void> {
    for (const event of events) {
      try {
        const topic = this.topicNameFormatter.formatFromEvent(event);
        const message = this.toMessage(event);

        await this.connection.publish({ topic, messages: [message] });
      } catch (error: any) {
        this.logger.error(error);
        await this.failoverPublisher.publish(event);
      }
    }
  }

  private toMessage(event: DomainEvent): Message {
    const eventPrimitives = DomainEventJsonSerializer.serialize(event);

    return { value: eventPrimitives };
  }
}
