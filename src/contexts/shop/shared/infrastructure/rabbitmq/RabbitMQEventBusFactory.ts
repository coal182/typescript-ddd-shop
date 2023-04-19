import { DomainEventFailoverPublisher } from '@infrastructure/event-bus/domain-event-failover-publisher/domain-event-failover-publisher';
import { RabbitMqConnection } from '@infrastructure/event-bus/rabbitmq/rabbitmq-connection';
import { RabbitMQEventBus } from '@infrastructure/event-bus/rabbitmq/rabbitmq-event-bus';
import { RabbitMQqueueFormatter } from '@infrastructure/event-bus/rabbitmq/rabbitmq-queue-formatter';

import { RabbitMQConfig } from './RabbitMQConfigFactory';

export class RabbitMQEventBusFactory {
  static create(
    failoverPublisher: DomainEventFailoverPublisher,
    connection: RabbitMqConnection,
    queueNameFormatter: RabbitMQqueueFormatter,
    config: RabbitMQConfig
  ): RabbitMQEventBus {
    return new RabbitMQEventBus({
      failoverPublisher,
      connection,
      exchange: config.exchangeSettings.name,
      queueNameFormatter: queueNameFormatter,
      maxRetries: config.maxRetries,
    });
  }
}
