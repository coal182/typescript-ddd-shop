import WinstonLogger from '@infrastructure/winston-logger';

import { DomainEvent } from '../../../domain/domain-event';
import { EventBus } from '../../../domain/event-bus';
import { DomainEventDeserializer } from '../domain-event-deserializer';
import { DomainEventFailoverPublisher } from '../domain-event-failover-publisher/domain-event-failover-publisher';
import { DomainEventJsonSerializer } from '../domain-event-json-serializer';
import { DomainEventSubscribers } from '../domain-event-subscribers';

import { RabbitMqConnection } from './rabbitmq-connection';
import { RabbitMQConsumerFactory } from './rabbitmq-consumer-factory';
import { RabbitMQqueueFormatter } from './rabbitmq-queue-formatter';

export class RabbitMQEventBus implements EventBus {
  private failoverPublisher: DomainEventFailoverPublisher;
  private connection: RabbitMqConnection;
  private exchange: string;
  private queueNameFormatter: RabbitMQqueueFormatter;
  private maxRetries: number;

  constructor(
    params: {
      failoverPublisher: DomainEventFailoverPublisher;
      connection: RabbitMqConnection;
      exchange: string;
      queueNameFormatter: RabbitMQqueueFormatter;
      maxRetries: number;
    },
    private logger: WinstonLogger
  ) {
    const { failoverPublisher, connection, exchange } = params;
    this.failoverPublisher = failoverPublisher;
    this.connection = connection;
    this.exchange = exchange;
    this.queueNameFormatter = params.queueNameFormatter;
    this.maxRetries = params.maxRetries;
  }

  async addSubscribers(subscribers: DomainEventSubscribers): Promise<void> {
    const deserializer = DomainEventDeserializer.configure(subscribers);
    const consumerFactory = new RabbitMQConsumerFactory(deserializer, this.connection, this.maxRetries, this.logger);

    for (const subscriber of subscribers.items) {
      const queueName = this.queueNameFormatter.format(subscriber);
      const rabbitMQConsumer = consumerFactory.build(subscriber, this.exchange, queueName);

      await this.connection.consume(queueName, rabbitMQConsumer.onMessage.bind(rabbitMQConsumer));
    }
  }

  async publish(events: Array<DomainEvent>): Promise<void> {
    for (const event of events) {
      try {
        const routingKey = event.eventName;
        const content = this.toBuffer(event);
        const options = this.options(event);

        await this.connection.publish({ exchange: this.exchange, routingKey, content, options });
      } catch (error: any) {
        console.log('📌 ~ error:', error);
        await this.failoverPublisher.publish(event);
      }
    }
  }

  private options(event: DomainEvent) {
    return {
      messageId: event.eventId,
      contentType: 'application/json',
      contentEncoding: 'utf-8',
    };
  }

  private toBuffer(event: DomainEvent): Buffer {
    const eventPrimitives = DomainEventJsonSerializer.serialize(event);

    return Buffer.from(eventPrimitives);
  }
}
