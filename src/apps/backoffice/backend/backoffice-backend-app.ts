import backofficeConfig from '@backoffice-backend/shared/infrastructure/config';
import {DomainEventSubscribers} from '@infrastructure/event-bus/domain-event-subscribers';
import {KafkaConnection} from '@infrastructure/event-bus/kafka/kafka-connection';
import {EventBus} from '@shared/domain/event-bus';
import {ContainerBuilder} from 'node-dependency-injection';

import {IncomingMessage, ServerResponse} from 'http';
import * as http from 'http';

import {containerFactory} from './dependency-injection';
import {Server} from './server';

export class BackofficeBackendApp {
    server?: Server;
    container: ContainerBuilder;

    async start(port = backofficeConfig.get('api.port') || '3000'): Promise<void> {
        this.container = await containerFactory();

        this.server = new Server(port, this.container);

        await this.configureEventBus();

        await this.server.listen();
    }

    get httpServer(): http.Server<typeof IncomingMessage, typeof ServerResponse> | undefined {
        return this.server?.getHTTPServer();
    }

    async stop(): Promise<void> {
        await this.getMessageBrokerConnection().close();
        return this.server?.stop();
    }

    private async configureEventBus(): Promise<void> {
        await this.connectMessageBroker();
        const eventBus = this.container.get<EventBus>('Shared.domain.EventBus');
        eventBus.addSubscribers(DomainEventSubscribers.from(this.container));
    }

    private async connectMessageBroker(): Promise<void> {
        await this.getMessageBrokerConnection().connect();
    }

    private getMessageBrokerConnection(): KafkaConnection {
        return this.container.get<KafkaConnection>('Shared.KafkaConnection');
    }
}
