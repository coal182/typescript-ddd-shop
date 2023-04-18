import 'module-alias/register';
import * as dotenv from 'dotenv';
dotenv.config();

import { TYPES } from '@storeback/shared/constants/types';
import { EventBus } from '@core/event-bus';
import { ICommandBus } from '@core/i-command-bus';

import { initialiseContainer } from './container';
import { FeedInventoryAggregator } from './feed-inventory-aggregator';
import { FeedParserFromContentType } from './feed-parser-from-content-type';
import { getBookstoreBookFeed } from './get-bookstore-book-feed';
import 'reflect-metadata';

(async () => {
  const container = await initialiseContainer();
  const baseEventHandler = container.get<EventBus>(TYPES.EventBus);
  baseEventHandler.subscribeEvents();
  console.log('Importing data...');
  const feed = getBookstoreBookFeed();

  const feedParserFromContentType = new FeedParserFromContentType();
  const parser = feedParserFromContentType.get(feed.contentType);
  const commandBus = container.get<ICommandBus>(TYPES.CommandBus);
  const feedInventoryAggregator = new FeedInventoryAggregator(commandBus, parser);
  feedInventoryAggregator.run(feed);
})();
