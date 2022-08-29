import { CommandBus } from '@infrastructure/command-bus';

import { Feed } from './feed';
import { FeedParser } from './feed-parser';

export class FeedInventoryAggregator {
  constructor(private parser: FeedParser, private commandBus: CommandBus) {}

  run(feed: Feed): void {
    const commands = this.parser.parse(feed);
    for (const command of commands) {
      //this.commandBus.send(command);
      console.log(command);
    }
  }
}
