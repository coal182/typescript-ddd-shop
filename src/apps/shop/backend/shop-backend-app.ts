import {ConfigureRabbitMQCommand} from '@backoffice-backend-app/command/configure-rabbitmq-command';
import {DomainEventSubscribers} from '@infrastructure/event-bus/domain-event-subscribers';
import {KafkaConnection} from '@infrastructure/event-bus/kafka/kafka-connection';
import {RabbitMqConnection} from '@infrastructure/event-bus/rabbitmq/rabbitmq-connection';
import {EventBus} from '@shared/domain/event-bus';
import shopConfig from '@shop-backend/shared/infrastructure/config';
import {ContainerBuilder} from 'node-dependency-injection';

import * as http from 'http';

import {ConfigureKafkaCommand} from './command/configure-kafka-command';
import {containerFactory} from './dependency-injection';
import {Server} from './server';

enum MessageBroker {
    Kafka = 'kafka',
    RabbitMq = 'rabbitmq',
}

export class ShopBackendApp {
    server?: Server;
    container: ContainerBuilder;
    messageBroker = shopConfig.get('messageBroker');

    async start(port = shopConfig.get('api.port') || '5001'): Promise<void> {
        this.container = await containerFactory();
        this.server = new Server(port, this.container);
        await this.configureEventBus();
        await this.server.listen();
    }

    get httpServer(): http.Server<typeof http.IncomingMessage, typeof http.ServerResponse> | undefined {
        return this.server?.getHTTPServer();
    }

    async stop(): Promise<void> {
        await this.getMessageBrokerConnection().close();
        return this.server?.stop();
    }

    private async configureEventBus(): Promise<void> {
        await this.configureMessageBroker();
        const eventBus = this.container.get<EventBus>('Shop.Shared.domain.EventBus');
        eventBus.addSubscribers(DomainEventSubscribers.from(this.container));
    }

    private async configureMessageBroker(): Promise<void> {
        if (this.messageBroker === MessageBroker.RabbitMq) await ConfigureRabbitMQCommand.run(this.container);
        if (this.messageBroker === MessageBroker.Kafka) await ConfigureKafkaCommand.run(this.container);
        await this.getMessageBrokerConnection().connect();
    }

    private getMessageBrokerConnection(): RabbitMqConnection | KafkaConnection {
        if (this.messageBroker === MessageBroker.RabbitMq) return this.container.get<RabbitMqConnection>('Shop.Shared.RabbitMQConnection');
        return this.container.get<KafkaConnection>('Shop.Shared.KafkaConnection');
    }
}
