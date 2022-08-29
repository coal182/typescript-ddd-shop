import { v4 as uuidv4 } from 'uuid';

import { CreateBookCommand } from '@storeback/book/application/commands/create-book';

import { Feed } from './feed';
import { FeedParser } from './feed-parser';

export class FeedParserJson implements FeedParser {
  parse(feed: Feed): Array<CreateBookCommand> {
    const items = JSON.parse(feed.content);
    return items.map((item: any) => {
      const id = uuidv4();

      const command = new CreateBookCommand(id, item.name, item.description, item.image, item.authorId, item.price);
      return command;
    });
  }
}
