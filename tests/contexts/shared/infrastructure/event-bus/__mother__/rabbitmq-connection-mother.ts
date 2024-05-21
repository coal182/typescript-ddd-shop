import {RabbitMqConnection} from '@infrastructure/event-bus/rabbitmq/rabbitmq-connection';

import {RabbitMQConnectionConfigurationMother} from './rabbitmq-connection-configuration-mother';

import {RabbitMQConnectionDouble} from '../__mocks__/rabbitmq-connection-double';

export class RabbitMQConnectionMother {
    static async create(): Promise<RabbitMqConnection> {
        const config = RabbitMQConnectionConfigurationMother.create();
        const connection = new RabbitMqConnection(config);
        await connection.connect();
        return connection;
    }

    static failOnPublish(): RabbitMQConnectionDouble {
        return new RabbitMQConnectionDouble(RabbitMQConnectionConfigurationMother.create());
    }
}
