import * as dotenv from 'dotenv';
import { ContainerBuilder } from 'node-dependency-injection';

import { DomainEventSubscribers } from '@infrastructure/event-bus/domain-event-subscribers';
import { RabbitMqConnection } from '@infrastructure/event-bus/rabbitmq/rabbitmq-connection';
import { EventBus } from '@shared/domain/event-bus';

import { ConfigureRabbitMQCommand } from './command/configure-rabbitmq-command';
import { containerFactory } from './dependency-injection';
import { Server } from './server';

dotenv.config();

export class ShopBackendApp {
  server?: Server;
  container: ContainerBuilder;

  async start(port = process.env.PORT || '5001') {
    this.container = await containerFactory();

    this.server = new Server(port, this.container);

    await this.configureEventBus();

    return this.server.listen();
  }

  get httpServer() {
    return this.server?.getHTTPServer();
  }

  async stop(): Promise<void> {
    const rabbitMQConnection = this.container.get<RabbitMqConnection>('Shop.Shared.RabbitMQConnection');
    await rabbitMQConnection.close();
    return this.server?.stop();
  }

  private async configureEventBus() {
    await ConfigureRabbitMQCommand.run(this.container);
    const eventBus = this.container.get<EventBus>('Shop.Shared.domain.EventBus');
    const rabbitMQConnection = this.container.get<RabbitMqConnection>('Shop.Shared.RabbitMQConnection');
    await rabbitMQConnection.connect();

    eventBus.addSubscribers(DomainEventSubscribers.from(this.container));
  }
}
