import * as dotenv from 'dotenv';
dotenv.config();

import { DomainEventSubscribers } from '@infrastructure/event-bus/domain-event-subscribers';
import { RabbitMqConnection } from '@infrastructure/event-bus/rabbitmq/rabbitmq-connection';
import { CommandBus } from '@shared/domain/command-bus';
import { EventBus } from '@shared/domain/event-bus';
import { ConfigureRabbitMQCommand } from '@shop-backend-app/command/configure-rabbitmq-command';
import { containerFactory } from '@shop-backend-app/dependency-injection';

import { FeedInventoryAggregator } from './feed-inventory-aggregator';
import { FeedParserFromContentType } from './feed-parser-from-content-type';
import { getBookstoreBookFeed } from './get-bookstore-book-feed';

(async () => {
  const container = await containerFactory();

  await ConfigureRabbitMQCommand.run(container);
  const eventBus = container.get<EventBus>('Shop.Shared.domain.EventBus');
  const rabbitMQConnection = container.get<RabbitMqConnection>('Shop.Shared.RabbitMQConnection');
  await rabbitMQConnection.connect();

  eventBus.addSubscribers(DomainEventSubscribers.from(container));

  console.log('📝 Importing data...');
  const feed = getBookstoreBookFeed();

  const feedParserFromContentType = new FeedParserFromContentType();
  const parser = feedParserFromContentType.get(feed.contentType);
  const commandBus = container.get<CommandBus>('Shop.Shared.domain.CommandBus');

  const feedInventoryAggregator = new FeedInventoryAggregator(commandBus, parser);
  feedInventoryAggregator.run(feed);
})();
