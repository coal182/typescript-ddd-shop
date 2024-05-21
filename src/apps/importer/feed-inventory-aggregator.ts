import {CommandBus} from '@shared/domain/command-bus';

import {Feed} from './feed';
import {FeedParser} from './feed-parser';

export class FeedInventoryAggregator {
    constructor(
        private readonly commandBus: CommandBus,
        private parser: FeedParser,
    ) {}

    async run(feed: Feed): Promise<void> {
        this.parser
            .parse(feed)
            .then((commands) => {
                for (const command of commands) {
                    this.commandBus.dispatch(command);
                    console.log('📝 ', command);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }
}
