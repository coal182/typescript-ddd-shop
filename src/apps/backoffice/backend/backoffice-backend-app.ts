import { ContainerBuilder } from 'node-dependency-injection';

import backofficeConfig from '@backoffice-backend/shared/infrastructure/config';
import { DomainEventSubscribers } from '@infrastructure/event-bus/domain-event-subscribers';
import { KafkaConnection } from '@infrastructure/event-bus/kafka/kafka-connection';
import { RabbitMqConnection } from '@infrastructure/event-bus/rabbitmq/rabbitmq-connection';
import { EventBus } from '@shared/domain/event-bus';

import { ConfigureKafkaCommand } from './command/configure-kafka-command';
import { containerFactory } from './dependency-injection';
import { Server } from './server';

export class BackofficeBackendApp {
  server?: Server;
  container: ContainerBuilder;

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
    // const rabbitMQConnection = this.container.get<RabbitMqConnection>('Backoffice.Shared.RabbitMQConnection');
    // await rabbitMQConnection.close();
    const kafkaConnection = this.container.get<KafkaConnection>('Backoffice.Shared.KafkaConnection');
    await kafkaConnection.close();
    return this.server?.stop();
  }

  private async configureEventBus() {
    //await ConfigureRabbitMQCommand.run(this.container);
    await ConfigureKafkaCommand.run(this.container);
    const eventBus = this.container.get<EventBus>('Backoffice.Shared.domain.EventBus');
    // const rabbitMQConnection = this.container.get<RabbitMqConnection>('Backoffice.Shared.RabbitMQConnection');
    // await rabbitMQConnection.connect();
    const kafkaConnection = this.container.get<RabbitMqConnection>('Backoffice.Shared.KafkaConnection');
    await kafkaConnection.connect();

    eventBus.addSubscribers(DomainEventSubscribers.from(this.container));
  }
}
