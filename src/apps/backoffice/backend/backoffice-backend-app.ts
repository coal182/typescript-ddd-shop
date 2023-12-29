import { ContainerBuilder } from 'node-dependency-injection';

import backofficeConfig from '@backoffice-backend/shared/infrastructure/config';
import { DomainEventSubscribers } from '@infrastructure/event-bus/domain-event-subscribers';
import { KafkaConnection } from '@infrastructure/event-bus/kafka/kafka-connection';
import { RabbitMqConnection } from '@infrastructure/event-bus/rabbitmq/rabbitmq-connection';
import { EventBus } from '@shared/domain/event-bus';

import { ConfigureKafkaCommand } from './command/configure-kafka-command';
import { ConfigureRabbitMQCommand } from './command/configure-rabbitmq-command';
import { containerFactory } from './dependency-injection';
import { Server } from './server';

enum MessageBroker {
  Kafka = 'kafka',
  RabbitMq = 'rabbitmq',
}

export class BackofficeBackendApp {
  server?: Server;
  container: ContainerBuilder;
  messageBroker = backofficeConfig.get('messageBroker');

  async start(port = backofficeConfig.get('api.port') || '3000') {
    this.container = await containerFactory();

    this.server = new Server(port, this.container);

    await this.configureEventBus();

    return this.server.listen();
  }

  get httpServer() {
    return this.server?.getHTTPServer();
  }

  async stop() {
    await this.getMessageBrokerConnection().close();
    return this.server?.stop();
  }

  private async configureEventBus() {
    await this.configureMessageBroker();
    const eventBus = this.container.get<EventBus>('Backoffice.Shared.domain.EventBus');
    eventBus.addSubscribers(DomainEventSubscribers.from(this.container));
  }

  private async configureMessageBroker() {
    if (this.messageBroker === MessageBroker.RabbitMq) await ConfigureRabbitMQCommand.run(this.container);
    if (this.messageBroker === MessageBroker.Kafka) await ConfigureKafkaCommand.run(this.container);
    await this.getMessageBrokerConnection().connect();
  }

  private getMessageBrokerConnection() {
    if (this.messageBroker === MessageBroker.RabbitMq)
      return this.container.get<RabbitMqConnection>('Backoffice.Shared.RabbitMQConnection');
    return this.container.get<KafkaConnection>('Backoffice.Shared.KafkaConnection');
  }
}
