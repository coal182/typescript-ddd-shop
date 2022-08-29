import { v4 as uuidv4 } from 'uuid';

import { CreateBookCommand } from '@storeback/book/application/commands/create-book';

import { Feed } from './feed';
import { FeedParser } from './feed-parser';

export class FeedParserCsv implements FeedParser {
  parse(feed: Feed): Array<CreateBookCommand> {
    const rows = feed.content.split('\n').slice(1);
    return rows.map((row) => {
      const fields = row.split(',');

      const id = uuidv4();

      const command = new CreateBookCommand(id, fields[0], fields[1], fields[2], fields[3], parseFloat(fields[4]));
      return command;
    });
  }
}
