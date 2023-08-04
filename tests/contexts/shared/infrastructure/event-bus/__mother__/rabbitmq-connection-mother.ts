import { RabbitMqConnection } from '@infrastructure/event-bus/rabbitmq/rabbitmq-connection';

import { RabbitMQConnectionDouble } from '../__mocks__/rabbitmq-connection-double';

import { RabbitMQConnectionConfigurationMother } from './rabbitmq-connection-configuration-mother';

export class RabbitMQConnectionMother {
  static async create() {
    const config = RabbitMQConnectionConfigurationMother.create();
    const connection = new RabbitMqConnection(config);
    await connection.connect();
    return connection;
  }

  static failOnPublish() {
    return new RabbitMQConnectionDouble(RabbitMQConnectionConfigurationMother.create());
  }
}
