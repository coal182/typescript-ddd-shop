import * as dotenv from 'dotenv';
dotenv.config();

import { DomainEventSubscribers } from '@infrastructure/event-bus/domain-event-subscribers';
import { KafkaConnection } from '@infrastructure/event-bus/kafka/kafka-connection';
import { CommandBus } from '@shared/domain/command-bus';
import { EventBus } from '@shared/domain/event-bus';
import { CreateUserCommand } from '@shop-backend/user/application/commands/create-user';

import { ConfigureKafkaCommand } from './command/configure-kafka-command';
import { containerFactory } from './dependency-injection';
import { FeedInventoryAggregator } from './feed-inventory-aggregator';
import { FeedParserFromContentType } from './feed-parser-from-content-type';
import { getShopProductsFeed } from './get-shop-products-feed';

(async () => {
  const container = await containerFactory();

  //await ConfigureRabbitMQCommand.run(container);
  await ConfigureKafkaCommand.run(container);
  const eventBus = container.get<EventBus>('Importer.Shared.domain.EventBus');
  // const rabbitMQConnection = container.get<RabbitMqConnection>('Importer.Shared.RabbitMQConnection');
  // await rabbitMQConnection.connect();
  const kafkaConnection = container.get<KafkaConnection>('Importer.Shared.KafkaConnection');
  await kafkaConnection.connect();

  eventBus.addSubscribers(DomainEventSubscribers.from(container));

  const feed = getShopProductsFeed();

  const feedParserFromContentType = new FeedParserFromContentType();
  const parser = feedParserFromContentType.get(feed.contentType);
  const commandBus = container.get<CommandBus>('Importer.Shared.domain.CommandBus');

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

  setTimeout(() => {
    //rabbitMQConnection.close().then(process.exit(0));
    kafkaConnection.close().then(process.exit(0));
  }, 20000);
})();
