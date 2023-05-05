import { Command } from '@shared/domain/command';

import { Feed } from './feed';

export class FeedParser {
  parse: (feed: Feed) => Promise<Array<Command>>;
}
