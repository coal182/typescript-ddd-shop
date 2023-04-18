import { ContainerBuilder } from 'node-dependency-injection';

import { DomainEventSubscribers } from '../../../../contexts/shared/infrastructure/EventBus/DomainEventSubscribers';
import { RabbitMQConfigurer } from '../../../../contexts/shared/infrastructure/EventBus/RabbitMQ/RabbitMQConfigurer';
import { RabbitMqConnection } from '../../../../contexts/shared/infrastructure/EventBus/RabbitMQ/RabbitMqConnection';
import { RabbitMQConfig } from '../../../../contexts/store/shared/infrastructure/RabbitMQ/RabbitMQConfigFactory';

export class ConfigureRabbitMQCommand {
  static async run(container: ContainerBuilder) {
    const connection = container.get<RabbitMqConnection>('Store.Shared.RabbitMQConnection');
    const { name: exchange } = container.get<RabbitMQConfig>('Store.Shared.RabbitMQConfig').exchangeSettings;
    await connection.connect();

    const configurer = container.get<RabbitMQConfigurer>('Store.Shared.RabbitMQConfigurer');
    const subscribers = DomainEventSubscribers.from(container).items;

    await configurer.configure({ exchange, subscribers });
    await connection.close();
  }
}
