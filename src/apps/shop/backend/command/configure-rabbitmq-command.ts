import { ContainerBuilder } from 'node-dependency-injection';

import { DomainEventSubscribers } from '../../../../contexts/shared/infrastructure/event-bus/domain-event-subscribers';
import { RabbitMQConfigurer } from '../../../../contexts/shared/infrastructure/event-bus/rabbitmq/rabbitmq-configurer';
import { RabbitMqConnection } from '../../../../contexts/shared/infrastructure/event-bus/rabbitmq/rabbitmq-connection';
import { RabbitMQConfig } from '../../../../contexts/shop/shared/infrastructure/rabbitmq/RabbitMQConfigFactory';

export class ConfigureRabbitMQCommand {
  static async run(container: ContainerBuilder) {
    const connection = container.get<RabbitMqConnection>('Shop.Shared.RabbitMQConnection');
    const { name: exchange } = container.get<RabbitMQConfig>('Shop.Shared.RabbitMQConfig').exchangeSettings;
    await connection.connect();

    const configurer = container.get<RabbitMQConfigurer>('Shop.Shared.RabbitMQConfigurer');
    const subscribers = DomainEventSubscribers.from(container).items;

    await configurer.configure({ exchange, subscribers });
    await connection.close();
  }
}
