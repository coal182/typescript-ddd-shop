import { inject, injectable } from 'inversify';

import { TYPES } from '@storeback/shared/constants/types';
import { ICommandBus } from '@core/i-command-bus';

import { Feed } from './feed';
import { FeedParser } from './feed-parser';

@injectable()
export class FeedInventoryAggregator {
  constructor(@inject(TYPES.CommandBus) private readonly commandBus: ICommandBus, private parser: FeedParser) {}

  run(feed: Feed): void {
    this.parser
      .parse(feed)
      .then((commands) => {
        for (const command of commands) {
          this.commandBus.send(command);
          console.log(this.commandBus);
          //console.log(command);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
