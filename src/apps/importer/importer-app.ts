import { ContainerBuilder } from 'node-dependency-injection';

import importerConfig from '@importer/shared/infrastructure/config';
import { DomainEventSubscribers } from '@infrastructure/event-bus/domain-event-subscribers';
import { KafkaConnection } from '@infrastructure/event-bus/kafka/kafka-connection';
import { RabbitMqConnection } from '@infrastructure/event-bus/rabbitmq/rabbitmq-connection';
import { CommandBus } from '@shared/domain/command-bus';
import { EventBus } from '@shared/domain/event-bus';
import { CreateUserCommand } from '@shop-backend/user/application/commands/create-user';

import { ConfigureKafkaCommand } from './command/configure-kafka-command';
import { ConfigureRabbitMQCommand } from './command/configure-rabbitmq-command';
import { containerFactory } from './dependency-injection';
import { FeedInventoryAggregator } from './feed-inventory-aggregator';
import { FeedParserFromContentType } from './feed-parser-from-content-type';
import { getShopProductsFeed } from './get-shop-products-feed';

enum MessageBroker {
  Kafka = 'kafka',
  RabbitMq = 'rabbitmq',
}

export class ImporterApp {
  container: ContainerBuilder;
  messageBroker = importerConfig.get('messageBroker');

  async start() {
    this.container = await containerFactory();
    await this.configureEventBus();

    await this.consumeFeed();

    await this.stop();
  }

  async stop() {
    setTimeout(async () => {
      await this.getMessageBrokerConnection().close().then(process.exit(0));
    }, 20000);
  }

  private async consumeFeed() {
    const feed = getShopProductsFeed();

    const feedParserFromContentType = new FeedParserFromContentType();
    const parser = feedParserFromContentType.get(feed.contentType);
    const commandBus = this.container.get<CommandBus>('Importer.Shared.domain.CommandBus');

    const feedInventoryAggregator = new FeedInventoryAggregator(commandBus, parser);
    await feedInventoryAggregator.run(feed);

    console.log('📝 Creating default user...');
    const createUserCommand: CreateUserCommand = new CreateUserCommand(
      '4b75043b-3d9c-42ad-ac00-8630d8435cd2',
      'niclife7@gmail.com',
      'Cristian',
      'Martin',
      new Date('1991-01-01T00:00:00.000+00:00'),
      '$2a$12$V.1oGxoe2aIhbhIH/DRmxep.wgK.t2z8dujW4Lku5q7VDT24kWMtS'
    );
    commandBus.dispatch(createUserCommand);
  }

  private async configureEventBus() {
    await this.configureMessageBroker();
    const eventBus = this.container.get<EventBus>('Importer.Shared.domain.EventBus');
    eventBus.addSubscribers(DomainEventSubscribers.from(this.container));
  }

  private async configureMessageBroker() {
    if (this.messageBroker === MessageBroker.RabbitMq) await ConfigureRabbitMQCommand.run(this.container);
    if (this.messageBroker === MessageBroker.Kafka) await ConfigureKafkaCommand.run(this.container);
    await this.getMessageBrokerConnection().connect();
  }

  private getMessageBrokerConnection() {
    if (this.messageBroker === MessageBroker.RabbitMq)
      return this.container.get<RabbitMqConnection>('Importer.Shared.RabbitMQConnection');
    return this.container.get<KafkaConnection>('Importer.Shared.KafkaConnection');
  }
}
