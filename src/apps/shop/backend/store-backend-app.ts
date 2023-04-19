import * as dotenv from 'dotenv';
import { ContainerBuilder } from 'node-dependency-injection';

import { DomainEventSubscribers } from '@infrastructure/EventBus/DomainEventSubscribers';
import { RabbitMqConnection } from '@infrastructure/EventBus/RabbitMQ/RabbitMqConnection';
import { EventBus } from '@shared/domain/EventBus';

import { ConfigureRabbitMQCommand } from './command/ConfigureRabbitMQCommand';
import { containerFactory } from './dependency-injection';
import { Server } from './server';

dotenv.config();

export class StoreBackendApp {
  server?: Server;
  container: ContainerBuilder;

  async start() {
    this.container = await containerFactory();

    const port = process.env.PORT || '3000';
    this.server = new Server(port, this.container);

    await this.configureEventBus();

    return this.server.listen();
  }

  get httpServer() {
    return this.server?.getHTTPServer();
  }

  async stop() {
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
