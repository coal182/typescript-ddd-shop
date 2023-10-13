import { ContainerBuilder } from 'node-dependency-injection';

import { DomainEvent } from '@domain/domain-event';
import { DomainEventSubscriber } from '@domain/domain-event-subscriber';
import { RabbitMQConfig } from '@importer/shared/infrastructure/rabbitmq/rabbitmq-config-factory';
import { RabbitMQConfigurer } from '@infrastructure/event-bus/rabbitmq/rabbitmq-configurer';
import { RabbitMqConnection } from '@infrastructure/event-bus/rabbitmq/rabbitmq-connection';

export class ConfigureRabbitMQCommand {
  static async run(container: ContainerBuilder) {
    const connection = container.get<RabbitMqConnection>('Importer.Shared.RabbitMQConnection');
    const { name: exchange } = container.get<RabbitMQConfig>('Importer.Shared.RabbitMQConfig').exchangeSettings;
    const retryTtl = container.get<RabbitMQConfig>('Importer.Shared.RabbitMQConfig').retryTtl;
    await connection.connect();

    const configurer = container.get<RabbitMQConfigurer>('Importer.Shared.RabbitMQConfigurer');
    const subscribers: Array<DomainEventSubscriber<DomainEvent>> = [];

    await configurer.configure({ exchange, subscribers, retryTtl });
    await connection.close();
  }
}
