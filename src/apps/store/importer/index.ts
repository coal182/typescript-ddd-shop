import { CommandBus } from '@infrastructure/command-bus';

import { FeedInventoryAggregator } from './feed-inventory-aggregator';
import { FeedParserFromContentType } from './feed-parser-from-content-type';
import { getBookstoreBookFeed } from './get-bookstore-book-feed';

console.log('Importing data...');
const feed = getBookstoreBookFeed();

const feedParserFromContentType = new FeedParserFromContentType();
const parser = feedParserFromContentType.get(feed.contentType);
const commandBus = new CommandBus();
const feedInventoryAggregator = new FeedInventoryAggregator(parser, commandBus);
feedInventoryAggregator.run(feed);
