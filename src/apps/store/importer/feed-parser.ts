import { ICommand } from '@core/i-command';

import { Feed } from './feed';

export class FeedParser {
  parse: (feed: Feed) => Promise<Array<ICommand>>;
}
